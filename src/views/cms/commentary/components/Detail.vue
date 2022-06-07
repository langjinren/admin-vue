<template>
  <div
    style="display: inline-block;">
    <el-button
      @click="openDialog"
      type="primary"
      >
      解说详情
    </el-button>
    <el-drawer
      :destroy-on-close="true"
      :append-to-body="true"
      :visible.sync="toggleDrawer"
      :with-header="false"
      :modal-append-to-body="false"
      :show-close="true"
      @close="closeDialog"
      size="80%">
      <el-form
        ref="MovieCommentaryRef"
        :rules="commentaryRules"
        :model="commentaryData"
        label-width="110px"
        :label-position="labelPosition">
        <el-form-item
          label="原始标题">
          <span class="g">{{commentaryData.video_title}}</span>
        </el-form-item>
        <el-form-item
          label="原始描述">
          <span class="g">{{commentaryData.video_description}}</span>
        </el-form-item>
        <el-form-item
          label="解说标题"
          prop="title">
            <el-input
              placeholder="解说标题"
              v-model.trim="commentaryData.title"
              :readonly="commentaryType == 2 || commentaryType ==1"
              maxlength="20"
              show-word-limit
              style="width: 50%; ">
            </el-input>
        </el-form-item>
        <el-form-item
          label="解说描述">
           <el-input
              placeholder="解说描述"
              v-model.trim="commentaryData.description"
              :readonly="commentaryType == 2 || commentaryType == 1"
              maxlength="100"
              show-word-limit
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              style="width: 50%; ">
            </el-input>
        </el-form-item>
        <el-form-item
          label="标签">
          <span v-if="commentaryData.tag_info!=null && commentaryData.tag_info.length==0">无</span>
          <div>
            <el-tag type="success" v-for="tag in commentaryData.tag_info" :key="tag.id" effect="dark" style="margin-right: 3px; ">
              {{tag.commentary_tag}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item
          v-if="commentaryType == 3 || commentaryType == 0"
          label="建议关联影片">
          <span class="g">{{commentaryData.recommend_movie_name}}</span>
        </el-form-item>
        <el-form-item
          label="影片名称">
          <el-input
            v-if="!isEdit"
            placeholder="影片名称"
            v-model="commentaryData.movie_name"
            readonly
            style="width: 50%; ">
          </el-input>
          <i class="el-icon-edit" v-if="!isEdit && (commentaryType == 0 || commentaryType == 3)" style="margin-left: 10px;" @click="isEdit = true"></i>
          <el-select
            v-if="isEdit"
            v-model="movieSelect.movie"
            value-key="movie_id"
            placeholder="输入影片名称 选择关联影片"
            filterable
            no-data-text="暂无匹配影片数据"
            no-match-text="暂无匹配影片数据"
            remote
            reserve-keyword
            :remote-method="toGetMovieList"
            v-loadmore:[movieSelect.direction]="loadMoreMovie"
            popper-class="movie_list"
            style="width: 50%; ">
            <el-option
              v-for="item in movieSelect.movieList"
              :key="item.movie_id"
              :label="item.movie_name"
              :value="item">
              <span style="float: left">{{ item.movie_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.movie_id }}</span>
            </el-option>
            <div v-if="movieSelect.movieLoading" style="width: 100; text-align: center; color: #9f9f9f; font-size: 13px">加载中...</div>
            <div v-if="movieSelect.loadAll" style="width: 100; text-align: center; color: #9f9f9f; font-size: 13px">加载完毕</div>
          </el-select>
          <i v-if="isEdit" class="el-icon-close" style="margin-left: 10px;" @click="cancelSaveMovie"></i>
        </el-form-item>
        <el-form-item
          label="资源">
          <span v-if="isMov" class="is_mov_video">
            * 如当前视频播放无画面有声音，请前往Safari试播。
          </span>
          <div v-show="sources.length > 0" style="max-height: 40vh;">
            <video
              ref="videoPlayer"
              class="video-js">
            </video>
          </div>
          <el-table
            :data="commentaryData.source_info_arr"
            border
            style="width: 100%;">
            <el-table-column
              prop="video_oss_audit_path"
              label="源片试播key" />
            </el-table-column>
            <el-table-column
              prop="source_status"
              width="200"
              label="资源状态">
              <template slot-scope="scope">
                {{sourceStatus[scope.row.source_status]}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80">
              <template slot-scope="scope">
                <el-button type="text" v-show="sources == scope.row.video_oss_audit_url" @click.native="toPilot('')" style="color: red;">关闭</el-button>
                <el-button type="text" v-show="sources != scope.row.video_oss_audit_url" id="pilot_button" @click.native="toPilot(scope.row.video_oss_audit_url)">试播</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="commentaryData.transcode_info && commentaryData.transcode_info.length"
            :data="commentaryData.transcode_info"
            border
            :show-header="false"
            style="width: 100%;">
            <el-table-column
              prop="template_type_name"
              width="100"
              label="清晰度" />
            <el-table-column
              prop="media_key"
              label="资源key" />
            <el-table-column
              prop="source_status"
              width="200"
              label="资源状态">
              <template slot-scope="scope">
                {{sourceStatus[scope.row.transcode_job_status]}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80">
              <template slot-scope="scope">
                <el-button type="text" v-if="sources == scope.row.media_url" @click="toPilot('')" style="color: red;">关闭</el-button>
                <el-button type="text" v-else @click="toPilot(scope.row.media_url)">试播</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="commentaryType != 2">
          <el-button
            type="success"
            :disabled="submitDisabled"
            :loading="submitSuccessLoading"
            @click="submitForm('0')"
            class="fr"
            style="margin-left: 10px; float: right; "
            >
            {{commentaryType==0?'提取':commentaryType==2?'上线':commentaryType==3?'保存并提交待发布':'发布'}}
          </el-button>
          <el-popover
            placement="bottom-end"
            min-width="120"
            trigger="click"
            :ref="`popoverRef`"
            v-if="commentaryType!=3"
          >
            <el-button size="mini" slot="reference" :loading="submitErrLoading" :disabled="submitDisabled" style="margin-left: 10px; float: right; ">{{commentaryType==0||commentaryType==3?'打回到创作者平台':commentaryType==2?'下线':'重新策划'}}</el-button>
            <el-form
              :model="commentaryData"
              :rules="commentaryRules"
              ref="auditForm"
              label-width="80px"
              label-position="left"
              size="mini"
              style="padding: 10px 0 0 10px; width: 400px; ">
              <el-form-item label="原因" :key="1" prop="audit_reason">
                <el-input v-model="commentaryData.audit_reason" type="textarea" resize="none" :placeholder="commentaryType == 0 && '请填写打回原因'" :autosize="{ minRows: 5, maxRows: 6}" />
              </el-form-item>
              <el-button size="mini" type="primary" style="float: right; margin-left: 10px;"  @click="toAudit('1')">确认</el-button>
              <el-button size="mini" style="float: right; " @click="$refs[`popoverRef`].doClose()">取消</el-button>
            </el-form>
          </el-popover>
          <el-popover
            placement="bottom-end"
            min-width="120"
            trigger="click"
            :ref="`popoverGiveUpRef`"
            v-if="commentaryType!=0"
          >
            <el-button size="mini" slot="reference" type="danger" :loading="submitErrLoading" :disabled="submitDisabled" style="margin-left: 10px; float: right; ">打回到创作者平台</el-button>
            <el-form
              :model="commentaryData"
              :rules="commentaryRules"
              ref="auditForm"
              label-width="80px"
              label-position="left"
              size="mini"
              style="padding: 10px 0 0 10px; width: 400px; ">
              <el-form-item label="原因" :key="1" prop="audit_reason">
                <el-input v-model="commentaryData.audit_reason" type="textarea" resize="none" placeholder="请填写打回原因" :autosize="{ minRows: 5, maxRows: 6}" />
              </el-form-item>
              <el-button size="mini" type="primary" style="float: right; margin-left: 10px;"  @click="giveUp">确认</el-button>
              <el-button size="mini" style="float: right; " @click="$refs[`popoverGiveUpRef`].doClose()">取消</el-button>
            </el-form>
          </el-popover>
          <el-button
            type="primary"
            @click="toGetWorkflow"
            class="fr"
            >
            查看工作流
          </el-button>
        </el-form-item>
        <el-form-item v-if="commentaryType == 2">
          <el-button
            type="primary"
            @click="toGetWorkflow"
            class="fr"
            >
            查看工作流
          </el-button>
          <el-button
            type="danger"
            @click="toInitCache"
            class="fr"
            style="margin-right: 5px; "
            >
            初始化解说缓存
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-dialog title="工作流状态" :visible.sync="visibleDialogWorkflow" width="70%" @close="workflowList = []">
      <el-table :data="workflowList" border :cell-style="setCellStyle">
        <el-table-column prop="workflow_status" label="工作流状态">
          <template slot-scope="scope">
            {{
              scope.row.workflow_status == "NOT_DO" ? "提取打回" : "" || 
              scope.row.workflow_status == "RELEASE_CANCEL" ? "重新策划" : "" || 
              scope.row.workflow_status == "RELEASE_FAIL" ? "发布打回" : "" || 
              scope.row.workflow_status == "RELEASE_PASS" ? "发布成功" : "" || 
              scope.row.workflow_status == "FAIL_AUDIT" ? "策划打回" : "" || 
              scope.row.workflow_status == "IN_AUDIT" ? "待发布" : "" || 
              scope.row.workflow_status == "IN_DO" ? "策划中" : "" || 
              scope.row.workflow_status == "RE_DO" ? "重新策划中" : ""
            }}
          </template>
        </el-table-column>
        <el-table-column prop="first_audit_user" label="提取操作人"></el-table-column>
        <el-table-column prop="first_audit_reason" label="提取打回原因"></el-table-column>
        <el-table-column prop="first_audit_time" label="提取时间" width="140"></el-table-column>
        <el-table-column prop="re_edit_user" label="策划操作人"></el-table-column>
        <el-table-column prop="re_edit_time" label="策划时间" width="140"></el-table-column>
        <el-table-column prop="release_user" label="发布操作人"></el-table-column>
        <el-table-column prop="release_reason" label="发布打回原因"></el-table-column>
        <el-table-column prop="release_time" label="发布时间" width="140"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getMovieCommentaryDetail, auditMovieCommentary, publishMovieCommentary, saveAssociatedMovie, giveUpCommentary, getWorkflow, initCache } from "@/api/cms/commentary/commentary";
import { getMovieList } from "@/api/cms/commentary/movie"

import ('video.js/dist/lang/zh-CN')
import videojs from 'video.js'
window.videojs = videojs
let player = null

let sourceStatus = {
  'PASS_TRANSCODE': '转码成功',
  'FAIL_TRANSCODE': '转码失败',
  'INIT': '初始化',
  'MULTI-BIT-PROCESS': '多码率转码中',
  'PASS_BASIC_TRANSCODE': '基础转码完成',
  'TRANSCODE_PROCESS': '转码中',
  'TRANSCODE_INIT': '转码初始化',
  'TRANSCODING': '转码中',
  'TRANSCODE_SECRET': '转码加密中',
  'TRANSCODE_FAILURE': '转码失败',
  'DRM_PROCESS': 'drm加密中',
  'SECURITY_PROCESS': '加密中',
  'START_SECURITY': '开始加密',
  'READY_SECURITY': '准备加密',
  'SECURITY_SUCCESSFUL': '加密成功',
  'SECURITY_FAILURE': '加密失败',
  'TRANSCODE_SUCCESSFUL': '转码成功',
  'WAIT_CLEAN_JOB': '等待清除任务',
  'READY_MULT_BIT': '准备多码率转码',
  'CLEANED_JOB': '清除任务'
}

export default {
  name: 'Detail',
  props: ['data', 'commentaryType', 'userName', 'onSuccess'],
  data () {
    return {
      visibleDialogWorkflow: false,
      workflowList: [],
      labelPosition: 'left',
      toggleDrawer: false,
      submitSuccessLoading: false,
      submitErrLoading: false,
      submitDisabled: false,
      isEdit: false,
      commentaryRules: {
        title: [{
          required: true,
          message: '解说标题不能为空',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '解说描述不能为空',
          trigger: 'blur'
        }],
        audit_reason: [{
          required: true,
          message: '原因不能为空',
          trigger: 'change'
        }]
      },
      commentaryData: {},
      movieSelect: {
        movie: '',
        movie_name: '',
        page_number: 1,
        page_size: 10,
        movieList: [],
        movieLoading: false,
        direction: 'movie_list',
        loadAll: false
      },
      videoOptions: {
        language: 'zh-CN',
        autoplay: true,
        controls: true,
        playbackRates: [0.5, 1, 1.5, 2, 3],
        controlBar: {
          volumePanel: {
            inline: false
          }
        },
        sources: [
          {
            src: "",
            type: "video/mp4"
          }
        ]
      },
      sources: '',
      sourceStatus,
      isMov: false
    }
  },
  methods: {
    initVideo() {
      let _this = this
      player = videojs(this.$refs.videoPlayer, this.videoOptions, function() {
        var baseComponent = videojs.getComponent('Component')
        var myComponent = videojs.extend(baseComponent, {
          constructor: function() {
            baseComponent.apply(this, arguments)
            this.on('click', this.clickIcon)
          },
          createEl: function() {
            var divObj = videojs.dom.createEl('div', {
              className: 'vjs-my-components',
              innerHTML:'<span></span>'
            })
            return divObj
          },
          clickIcon: function() {
            player.pause()
            let Detail = _this.$router.resolve({
              name: 'Video',
              query:{
                src: _this.videoOptions.sources[0].src,
                currentTime: Math.floor(player.currentTime())
              }
            })
            window.open(Detail.href, '_blank')
          }
        })
        videojs.registerComponent('myComponent', myComponent)
        player.getChild('controlBar').addChild('myComponent')
      })
      this.onKeyup()
      player.load(this.sources)
      player.volume(0.5)
      player.play()
    },
    toPilot(src) {
      document.getElementById('pilot_button').blur()
      let type = src.toLocaleLowerCase()
      if ((!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)))) {
        this.isMov = true
      }
      this.$set(this.videoOptions.sources[0], 'type', type.length>0&&type.indexOf('m3u8') >=0 ? "application/x-mpegURL" : "video/mp4")
      this.$set(this.videoOptions.sources[0], 'src', src)
      this.sources = src
      if (src != '') {
        if (player) {
          player.src({
            type: src.length>0&&src.indexOf('m3u8') >=0 ? "application/x-mpegURL": "video/mp4",
            src
          })
          player.load(src)
          player.play()
        } else {
          this.initVideo()
        }
      } else {
        player && player.pause()
      }
    },
    loadMoreMovie() {
      let { movieLoading, loadAll } = this.movieSelect
      if (movieLoading || loadAll) {
        return
      }
      this.toGetMovieList('', false)
    },
    openDialog() {
      this.isEdit = false
      this.submitDisabled = false
      this.toggleDrawer = true
      this.cancelSaveMovie()
      this.$set(this.movieSelect, 'movie', '')
      this.$set(this.movieSelect, 'movieList', [])
      let { explain_id, commentary_id } = this.data
      this.getDetail({
        commentary_id: this.commentaryType == 0 ? explain_id: commentary_id,
        commentary_type: this.commentaryType
      })
    },
    closeDialog() {
      this.submitSuccessLoading = false
      this.submitErrLoading = false
      this.submitDisabled = false
      this.sources = ''
      player && player.pause()
      player = null
      document.onkeydown = undefined
    },
    submitForm(audit_status) {
      this.$refs[audit_status == 0?'MovieCommentaryRef':'auditForm'].validate((valid) => {
        if (valid) {
          if (this.commentaryType == 3) {
            this.saveMovie()
          } else {
            audit_status == 0 && this.toAudit(audit_status)
          }
        } else {
          return false
        }
      })
    },
    cancelSaveMovie() {
      this.isEdit = false
      this.$set(this.movieSelect, 'movie_id', '')
      this.$set(this.movieSelect, 'page_number', 1)
      this.$set(this.movieSelect, 'movieList', [])
      this.$set(this.movieSelect, 'loadAll', false)
    },
    saveMovie() {
      let { movie = {} } = this.movieSelect
      let { explain_id, commentary_id, movie_id } = this.data
      let associated_movie
      if (this.isEdit) {
        associated_movie = movie.movie_id || ''
      } else {
        associated_movie = this.data.movie_id || ''
      }
      let { description, title } = this.commentaryData
      let content = {
        associated_movie,
        commentary_id: this.commentaryType == 0 ? explain_id: commentary_id,
        user_name: this.userName,
        description,
        title
      }
      saveAssociatedMovie(content).then((res) => {
        if (res.code == '000000') {
          this.$message.success('操作成功')
          this.toggleDrawer = false
          this.closeDialog()
          this.cancelSaveMovie()
          this.onSuccess()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getDetail({
      commentary_id,
      commentary_type
    }) {
      getMovieCommentaryDetail({
        commentary_id,
        commentary_type
      }).then((res) => {
        if (res.code == '000000') {
          this.commentaryData = res.content
          this.$set(this.commentaryData, 'source_info_arr', [res.content.source_info || {}])
          this.$set(this.commentaryData, 'transcode_info', res.content.source_info.transcode_info || [])
          this.$set(this.commentaryData, 'audit_reason', '')
          this.$set(this.commentaryData, 'video_title', res.content.video_title || '')
          this.$set(this.commentaryData, 'video_description', res.content.video_description || '')
          this.$set(this.commentaryData, 'title', res.content.title || '')
          this.$set(this.commentaryData, 'description', res.content.description || '')
        }
      })
    },
    toGetMovieList(movie_name, flag) {
      if(flag == undefined) {
        this.$set(this.movieSelect, 'movie_name', movie_name)
      }
      if (this.movieLoading) {
        return
      }
      if(movie_name!= '') {
        this.$set(this.movieSelect, 'page_number', 1)
        // this.$set(this.movieSelect, 'movieList', [])
        this.$set(this.movieSelect, 'loadAll', false)
      }
      if (this.movieSelect.movie_name == '') {
        this.$set(this.movieSelect, 'page_number', 1)
        this.$set(this.movieSelect, 'movieList', [])
        this.$set(this.movieSelect, 'loadAll', false)
        return
      }
      this.$set(this.movieSelect, 'movieLoading', true)
      getMovieList({
        ...this.movieSelect
      }).then((res) => {
        let { page_number, movieList, page_size } = this.movieSelect
        if (res.total_size > 0) {
          if (page_number==1) {
            this.$set(this.movieSelect, 'movieList', res.movie_list)
          } else {
            let newDate = [...movieList, ...res.movie_list]
            let map = new Map();
            for(let item of newDate){
              if(!map.has(item.movie_id)){
                map.set(item.movie_id, item)
              }
            }
            this.$set(this.movieSelect, 'movieList', [...map.values()])
          }
          if (res.movie_list.length < page_size) {
            this.$set(this.movieSelect, 'loadAll', true)
          }
          this.$set(this.movieSelect, 'page_number', page_number+1)
        }
        this.$set(this.movieSelect, 'movieLoading', false)
      })
    },
    async toAudit(audit_status) {
      let { movie = {} } = this.movieSelect
      this.submitDisabled = true
      if (audit_status == 1) {
        this.submitErrLoading = true
      } else {
        this.submitSuccessLoading = true
      }
      let { explain_id, commentary_id } = this.data
      let { movie_id, audit_reason, description, title } = this.commentaryData
      switch (Number(this.commentaryType)) {
        case 0:
          // 审核
          auditMovieCommentary({
            associated_movie: movie.movie_id != '' ? movie.movie_id : movie_id,
            audit_reason,
            audit_status: audit_status == 0 ? true : false,
            commentary_id: explain_id,
            user_name: this.userName,
            description,
            title
          }).then((res) => {
            if (res.code == '000000') {
              this.$message.success('操作成功')
              this.onSuccess && this.onSuccess()
              this.toggleDrawer = false
              this.closeDialog()
            } else {
              this.$message.error(res.message)
            }
            this.cancelSaveMovie()
            this.submitSuccessLoading = false
            this.submitErrLoading = false
            this.submitDisabled = false
            this.isEdit = false
          })
          break;
        case 1:
          // 发布
          publishMovieCommentary({
            cancel_publish_reason: audit_reason,
            publish_status: audit_status == 0 ? true : false,
            commentary_id: commentary_id,
            user_name: this.userName
          }).then((res) => {
            if (res.code == '000000') {
              this.$message.success('操作成功')
              this.onSuccess && this.onSuccess()
              this.toggleDrawer = false
              this.closeDialog()
            } else {
              this.$message.error(res.message)
            }
            this.cancelSaveMovie()
            this.submitSuccessLoading = false
            this.submitErrLoading = false
            this.submitDisabled = false
            this.isEdit = false
          })
          break;
      }
      this.$refs[`popoverRef`].doClose()
    },
    toInitCache() {
      this.$msgbox({
        title: '请确认初始化解说缓存',
        showCancelButton: true,
        confirmButtonText: '确认初始化解说缓存',
        cancelButtonText: '取消'
      }).then(() => {
        let { commentary_id } = this.data
        initCache({
          commentary_id
        }).then((res) => {
          if (res.code == '000000') {
            this.$message.success('操作成功')
          } else {
            this.$message.error(res.message)
          }
        })
      });
    },
    toGetWorkflow() {
      this.visibleDialogWorkflow = true
      let { explain_id, commentary_id } = this.data
      getWorkflow({
        commentary_id: this.commentaryType == 0 ? explain_id: commentary_id
      }).then((res) => {
        if (res.code == '000000') {
          this.workflowList = res.content
        }
      })
    },
    setCellStyle({row, column, rowIndex, columnIndex}) {
      if(columnIndex === 0) {
        return 'background-color: rgb(240, 249, 235);';
      }
      if(columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        return 'background-color: rgb(217, 236, 255);';
      }
      if(columnIndex === 4 || columnIndex === 5) {
        return 'background-color: rgb(253, 246, 236);';
      }
      if(columnIndex === 6 || columnIndex === 7 || columnIndex === 8) {
        return 'background-color: rgb(240, 249, 235);';
      }
    },
    giveUp() {
      let { explain_id } = this.data
      let { audit_reason } = this.commentaryData
      giveUpCommentary({
        give_up_reason: audit_reason,
        explain_id,
        user_name: this.userName
      }).then((res) => {
        if (res.code == '000000') {
          this.$message.success('操作成功')
          this.onSuccess && this.onSuccess()
          this.toggleDrawer = false
          this.closeDialog()
        } else {
          this.$message.error(res.message)
        }
        this.cancelSaveMovie()
        this.submitSuccessLoading = false
        this.submitErrLoading = false
        this.submitDisabled = false
        this.isEdit = false
      })
    },
    onKeyup() {
      let time = 5
      let _this = this
      document.onkeyup = function (event) {
        if (_this.sources === '') return
        if (player === null) return
        var e = event || window.event || arguments.callee.caller.arguments[0];
        let _currentTime = player.currentTime()
        let _duration = player.duration()
        if (e && e.keyCode === 37) {
          // 按 向左键
          player.currentTime(_currentTime !== 0 ? _currentTime -= time : 1)
          return false;
        } else if (e && e.keyCode === 39) {
          // 按 向右键
          player.currentTime(_currentTime !== _duration ? _currentTime += time : 1)
          return false;
        } else if (e && e.keyCode === 32) {
          // 按空格键 判断当前是否暂停
          if (_this.sources === '') return
          player.paused() === true ? player.play() : player.pause();
          return false;
         }
      }
    }
  }
}
</script>

<style>
.el-drawer__body {
  padding: 15px; 
}

.video-js .vjs-picture-in-picture-control {
  display: none;
}

.video-js {
  width: 100%;
  max-height: 40vh;
}

.video-js .vjs-fullscreen-control {
  display: none;
}
.vjs-icon-fullscreen-enter:before, .video-js .vjs-my-components {
  position: relative;
  text-align: center;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 4em;
  cursor: pointer;
  flex: none;
}
.vjs-icon-fullscreen-enter:before, .video-js .vjs-my-components span {
  display: block;
  font-family: VideoJS;
  font-size: 2em;
  line-height: 1.67;
}
.vjs-icon-fullscreen-enter:before, .video-js .vjs-my-components span:before {
  content: "\f108";
}
.is_mov_video {
  display: inline-block;
  color: #f42c2c;
  font-size: 20px;
  margin-bottom: 10px;
}
</style>