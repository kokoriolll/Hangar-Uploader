/* eslint-disable */
// import HangarUploader from './HangarUploader';

import axios from 'axios';
import qs from 'qs';
import storage from 'store';
import { ACCESS_TOKEN } from '../../examples/store/mutation-types';
import SparkMD5 from 'spark-md5';
import { fileType } from './fileTypeConfig';
import { has } from 'lodash';
import {uploaderStyle} from "./config";

const hangarUploader =  {
  name: 'HangarUploader',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    uploadOptions: {
      type: Object,
      default: () => {}
    },
    downloadUrl: {
      type: String,
      default: '/api/fileInfos/download?id='
    },
    openPdfUrl: {
      type: String,
      default: '/api/fileInfos/showPdf?id='
    },
    uploadMergeFileUrl: {
      type: String,
      default: '/api/fileInfos/mergeFile'
    },
    attrs: {
      type: Object,
      default: () => {
        return {
          accept: ''
        };
      }
    },
    fileNumber: {
      type: Number,
      default: 2
    }
  },
  watch: {
    value: {
      handler(val) {
        if (!val) return;
        this.fileData = JSON.parse(val);
      },
      immediate: true
    },
    uploadOptions: {
      handler(val) {
        Object.assign(this.options, val);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      fileType,
      sequence: [], // 待合并序列
      resetUploader: true,
      fileData: [], // 附件所存信息
      options: {
        simultaneousUploads: 1, // 上传分片的并发数，默认3
        target: '/api/fileInfos/chunk',
        chunkSize: 10 * 1024 * 1024,
        singleFile: true,
        headers: {
          Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN)
        },
        autoStart: false,
        // 验证断点续传和秒传
        checkChunkUploadedByResponse: (chunk, message) => {
          const objMessage = JSON.parse(message);
          // 判断返回值，如果是断点续传的文件，找到分片1的id设置成校验码
          if (objMessage.uploadedList && this.uploadedChunks.length === 0) {
            const { uploadedList } = objMessage;
            uploadedList.forEach(item => {
              this.uploadedChunks.push(item.chunkNumber);
              if (item.chunkNumber === 1) {
                this.$set(this.options.query, 'checkCode', item.id);
              }
            });
          }
          // 判断文件是否是断点续传、秒传或者是重新上传的
          if (objMessage.uploadedList && this.uploadedChunks.length > 0) {
            this.uploadFlag = 0;
          } else {
            this.uploadFlag = 1;
          }
          // 判断当前文件是否上传过？如果上传过，保存文件在服务中的位置，在合并文件接口中返回改值
          if (objMessage.uploadFolder) {
            this.location = objMessage.uploadFolder;
            this.$set(this.options.query, 'uploadFolder', objMessage.uploadFolder);
          }
          // 判断当前上传文件的碎片是否上传过
          return (this.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0;
        },
        query: {
          checkCode: undefined,
          uploadFolder: undefined
        },
        // 接受到第一片的返回值
        processResponse: (response, cb) => {
          const objMessage = JSON.parse(response);
          // 判断接收到第一片的返回值
          if (objMessage && objMessage.code === 200) {
            this.$set(this.options.query, 'checkCode', objMessage.data);
          }
          cb(null, response);
        }
      },
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中',
        computedMD5: '校验中'
      }, // 自定义文字
      visible: false, // 上传组件弹窗
      confirmLoading: false,
      previewVisible: false, // 图片预览弹窗
      previewImage: '', // 图片的地址
      isComputeMD5Show: false, // 是否显示计算MD5的提示
      uploadedChunks: [],
      uploadFlag: undefined, // 秒传，断点续传 - 0 正常上传，修改分片后重新上传 - 1
      location: undefined // 当前上传文件保存的文件位置
    };
  },
  methods: {
    /**
     * @method 删除附件
     * @desc 根据索引删除附件列表
     * @param {number} index 数组索引
     * @return {type} 无返回
     */
    delFile(index) {
      this.$confirm({
        title: '确定要删除吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.fileData.splice(index, 1);
          if (this.fileData.length === 0) {
            this.$emit('input', '');
          } else {
            this.$emit('input', JSON.stringify(this.fileData));
          }
          this.$message.success('保存成功');
        }
      });
    },
    /**
     * @description 下载附件
     * @param {Object} item 当前文件的ID和NAME
     * @Modify
     */
    download(item) {
      window.open(`${this.downloadUrl}${item.id}`);
    },
    /**
     * @description 预览PDF
     * @param {Object} item 当前文件的ID和NAME
     */
    openPdf(item) {
      window.open(this.openPdfUrl + item.id, '_blank');
    },
    /**
     * 取消上传
     */
    handleCancel() {
      this.visible = false;
      this.resetUploader = false;
      setTimeout(() => {
        this.resetUploader = true;
      }, 500);
      this.options.query.checkCode = undefined;
      this.uploadedChunks = [];
      this.uploadFlag = undefined;
    },
    /**
     * 确认上传完毕
     */
    handleOk() {
      this.sequence.forEach(item => {
        this.fileData.push(item);
      });
      this.$emit('input', JSON.stringify(this.fileData));
      this.$message.success('保存成功');
      this.visible = false;
      this.resetUploader = false;
      setTimeout(() => {
        this.resetUploader = true;
      }, 500);
    },
    /**
     * 打开上传控件窗口
     * 初始化上传控件
     */
    openUploader() {
      this.visible = true;
      this.$nextTick(() => {
        this.sequence = [];
      });
    },
    /**
     * 上传到最后，合并文件碎片
     */
    fileComplete() {
      this.sequence = [];
      const file = arguments[0].file;
      axios
        .post(
          this.uploadMergeFileUrl,
          qs.stringify({
            filename: file.name,
            identifier: arguments[0].uniqueIdentifier,
            totalSize: file.size,
            type: file.type,
            uploadFlag: this.uploadFlag,
            location: this.location
          }),
          {
            headers: {
              Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN)
            }
          }
        )
        .then(resp => {
          this.sequence.push({
            id: resp.data.data.id,
            name: resp.data.data.filename
          });
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(() => {
          // 清除当前的碎片信息，验证码、文件路径和上传状态标识 防止再次上传时出错
          this.uploadedChunks = [];
          this.options.query.checkCode = undefined;
          this.options.query.uploadFolder = undefined;
          this.uploadFlag = undefined;
          this.location = undefined;
        });
    },
    /**
     * 上传文件失败后的回调函数
     */
    fileError(rootFile, file, message) {
      const fileResponse = JSON.parse(message);
      if (fileResponse.code && fileResponse.code === 500) {
        return this.$message.error(
          fileResponse.message !== 'Index: 1, Size: 1' ? fileResponse.message : '不支持的文件类型'
        );
      }
    },
    /**
     * @method 上传前的事件
     * @desc 解释说明
     * @return {type} 无返回
     */
    fileAdded(file) {
      this.computeMD5(file);
      let result = false;
      // 判断文件个数
      const length = this.fileData.length;
      if (length >= this.fileNumber) {
        this.$message.error(`最多上传 ${this.fileNumber} 个文件`);
        file.ignored = !result;
        return result;
      }

      // 判断文件上传类型，先判断类型是不是包含'',这种情况下任何文件都可以上传
      const acceptType = this.attrs.accept;
      const fileTypeArray = acceptType.split(',');
      const allType = fileTypeArray.some(i => i === '');

      if (allType) {
        result = true;
        return result;
      }

      const idx = file.name.lastIndexOf('.');
      const ext = file.name.substr(idx).toLowerCase();
      result = fileTypeArray.includes(ext);
      file.ignored = !result;
      if (!result) {
        this.$message.error(`请上传 ${acceptType} 文件`);
      }
      return result;
    },
    /**
     * @method 计算文件的MD5
     * @param {Object} file 待上传文件的实体
     * @return {type} 无返回
     */
    computeMD5(file) {
      const fileReader = new FileReader();
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 10 * 1024 * 1000;
      const chunks = Math.ceil(file.size / chunkSize);
      const spark = new SparkMD5.ArrayBuffer();
      file.pause();
      this.isComputeMD5Show = true;
      loadNext();
      fileReader.onload = e => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
        } else {
          const md5 = spark.end();
          file.uniqueIdentifier = md5;
          file.resume();
          this.isComputeMD5Show = false;
        }
      };
      fileReader.onerror = function() {
        this.$message.error(`文件${file.name}读取出错，请检查该文件`);
        this.isComputeMD5Show = false;
        file.cancel();
      };
      function loadNext() {
        const start = currentChunk * chunkSize;
        const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },
    /**
     * @description 预览照片
     * @param {Object} item 当前文件的ID和NAME
     * @Modify
     */
    picViewer(item) {
      this.previewVisible = true;
      this.previewImage = `${this.downloadUrl}${item.id}`;
    },
    /**
     * @description 预览弹窗的关闭事件
     */
    handleViewCancel() {
      this.previewVisible = false;
      setTimeout(() => {
        this.previewImage = '';
      }, 300);
    },
    /**
     * @desc 判断当前文件是否可以预览
     * @param extension {String} 当前文件的扩展名
     * @param field {String} 需要判断的字段名
     * @return {Boolean} 返回true或false来判断是否显示预览按钮
     */
    isPreviewShow(extension, field) {
      return has(fileType[extension], field);
    }
  },
  render() {
    console.log('render', this.fileData);
    return (
      <section>
        <div class="box">
          <div>
            <span>{ this.text }</span>
            { this.disabled ? '' : <a-button onClick={ this.openUploader } type="link">上传</a-button> }
          </div>
          { this.fileData ?
            <div class="file-item">
              {this.fileData.map((item, index) => {
                console.log('item', item);
                const extension = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
                return (
                  <section>
                    <span class="file-type">
                      {fileType[extension] ?
                        <a-icon type={fileType[extension].icon} style={{color: fileType[extension].color}}/> :
                        <a-icon v-else type="file"/>}
                    </span>
                    <span class="file-name">{item.name}</span>
                    <span class="file-function">
                      <a onClick={() => this.download(item)}>下载</a>
                      {this.isPreviewShow(extension, 'pdfPreview') ? <a onClick={() => this.openPdf(item)}>预览</a> : ''}
                      {this.isPreviewShow(extension, 'preview') ? <a onClick={() => this.picViewer(item)}>预览</a> : ''}
                      {this.disabled ? '' : <a-icon vOn:Click_stop_prevent={() => this.delFile(index)} type="close"/>}
                    </span>
                  </section>
                )
              })}
            </div>
            : '' }
          <a-modal
            maskClosable={ false }
            visible={ this.visible }
            confirmLoading={ this.confirmLoading }
            width="1000px"
            title="上传"
            on-ok={ this.handleOk }
            on-cancel={ this.handleCancel }
            okText="保存"
            cancelText="取消"
          >
            { this.isComputeMD5Show ? <div class="spin-box">
              <a-spin class="bodySpin" spinning={ this.isComputeMD5Show } tip="正在校验文件，请稍等" />
            </div> : '' }
            { this.resetUploader ?
              <uploader
                options={ this.options }
                fileStatusText={ this.statusText }
                class="uploader-example enclosure"
                on-file-complete={ this.fileComplete }
                on-file-error={ this.fileError }
                on-file-added={ this.fileAdded }
              >
                <uploader-unsupport></uploader-unsupport>
                <uploader-drop>
                  <uploader-btn attrs={ this.attrs }>
                  <a-icon style="font-size: 48px; color: #1890ff" type="inbox" />
                  <p style="font-size: 18px; margin-top: 20px; font-weight: 600;">
                    拖动文件到此处，或点击此处
                  </p>
                </uploader-btn>
              </uploader-drop>
              <uploader-list></uploader-list>
              </uploader>
              : '' }
          </a-modal>
          <a-modal visible={ this.previewVisible } footer={ null } width={ 800 } onCancel={this.handleViewCancel}>
            <img style="width: 100%; margin-top: 20px;" { ...{ props: { src: this.previewImage } } }/>
          </a-modal>
        </div>
        <style>{ uploaderStyle }</style>
      </section>
    )
  }
}

hangarUploader.install = function(Vue) {
  Vue.component(hangarUploader.name, hangarUploader);
};

export default hangarUploader;
