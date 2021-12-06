<!--
* @Description:
-->
<template>
  <div style="display: inline-block;margin: 0 10px;">
    <div>
      <span>{{ text }}</span>
      <a-button @click="openUploader" v-if="!disabled" type="link">
        上传
      </a-button>
    </div>
    <div class="file-item" v-for="(item, index) in fileData" :key="index">
      <!-- 判断文件图标 -->
      <span class="file-type">
        <a-icon
          v-if="fileType[item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase()]"
          :type="fileType[item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase()].icon"
          :style="{ color: fileType[item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase()].color }"
        />
        <a-icon v-else type="file" />
      </span>
      <!-- 文件名称 -->
      <span class="file-name" :title="item.name">{{ item.name }}</span>
      <!-- 文件操作 -->
      <span class="file-function">
        <a @click="download(item)">下载</a>
        <a v-if="isPreviewShow(item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase(), 'pdfPreview')" @click="openPdf(item)" >预览</a>
        <a v-if="isPreviewShow(item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase(), 'preview')" @click="picViewer(item)" >预览</a>
        <a-icon v-if="!disabled" @click.stop="delFile(index)" type="close" />
      </span>
    </div>
    <div style="display: none">{{ fileData }}</div>
    <!-- 上传弹窗 -->
    <a-modal
      :maskClosable="false"
      width="1000px"
      title="上传"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div v-if="isComputeMD5Show" class="spin-box">
        <a-spin class="bodySpin" :spinning="isComputeMD5Show" tip="正在校验文件，请稍等" />
      </div>
      <uploader
        v-if="resetUploader"
        :options="options"
        class="uploader-example enclosure"
        :file-status-text="statusText"
        ref="uploader"
        @file-complete="fileComplete"
        @file-error="fileError"
        @file-added="fileAdded"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <uploader-btn :attrs="attrs">
            <a-icon style="font-size: 48px; color: #1890ff" type="inbox" />
            <p style="font-size: 18px; margin-top: 20px; font-weight: 600;">
              拖动文件到此处，或点击此处
            </p>
          </uploader-btn>
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>
    </a-modal>
    <!-- 图片预览弹窗 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleViewCancel" :width="800">
      <img style="width: 100%; margin-top: 20px;" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
  /* eslint-disable */
  import axios from 'axios';
  import qs from 'qs';
  import storage from 'store';
  import { ACCESS_TOKEN } from '../../examples/store/mutation-types';
  import SparkMD5 from 'spark-md5';
  import { fileType } from './fileTypeConfig';
  import { has } from 'lodash';
  export default {
  };
</script>

<style>
  .spin-box {
    z-index: 1001 !important;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
  }

  .bodySpin .ant-spin-dot-spin {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -10px;
  }

  .bodySpin .ant-spin-text {
    width: 400px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: 30px;
    margin-left: -200px;
    font-weight: 600;
  }

  .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 0 auto;
    font-size: 12px;
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .file-item {
    cursor: pointer;
    width: 400px;
    margin: 10px 0;
    border: 1px solid #e9e9e9;
    border-radius: 2px;
    padding: 10px;
    overflow: hidden;
  }

  .file-type {
    float: left;
    width: 30px;
    height: 30px;
    font-size: 30px;
    text-align: center;
    line-height: 30px;
  }

  .file-name {
    float: left;
    width: 260px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .file-function {
    float: left;
    width: 84px;
    height: 30px;
    line-height: 30px;
    text-align: right;
  }

  .file-function > a {
    font-size: 12px;
    margin-left: 6px;
  }

  .file-function > i {
    margin-left: 4px;
  }

  .enclosure .uploader-drop {
    border: 0 !important;
    background-color: white !important;
  }

  .enclosure .uploader-btn {
    display: block;
    border: 0;
    padding: 0;
    text-align: center;
  }
</style>
