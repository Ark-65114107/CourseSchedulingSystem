<template>
  <div class="scheduling" v-show="isScheduling">
    <el-text class="schedulingTitle">自动排课中...</el-text><br />
    <div class="schedulingContent">
      <el-text class="schedulingText">排课进度</el-text>
    </div>
    <el-button @click="testimporve">+</el-button>
    <el-button @click="initAutoScheduleMessage">reset</el-button>
    <el-button @click="startWS">startWS</el-button>
    <el-button @click="sendWS">sendWS</el-button>
    <el-text type="info" size="small">AI模型为豆包1.5pro</el-text>
    <el-scrollbar class="chartScrollBar" height="375px">
      <div class="chatView">
        <div
          class="chatMessage"
          v-for="msg of autoSchedulingProgressMessage"
          v-show="msg.isShow"
        >
          <img class="chatAvatar" src="@/assets/aiLogo.png" />
          <div class="chatTextBorder">
            <el-text class="chatText"
              >{{ msg.message }}
              {{ msg.errorMessage }}
              <div class="chatLoading" v-show="msg.isLoading"></div>
            </el-text>
            <el-progress
              class="chatProgress"
              v-show="msg.isProgressShow"
              :percentage="autoSchedulingProgress"
            ></el-progress>
            <div v-show="msg.isResultShow" class="autoScheduleInfo">
              <el-text>未排课程</el-text>

              <div class="courseItem" v-for="item of msg.resultData">
                {{ item.courseName }}
                原因:{{ item.reason }}
              </div>
              <el-link
                type="primary"
                class="downLoadLink"
                @click="HandleResultDownLoad"
                >排课结果下载</el-link
              >
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import bus from "@/bus/bus";

export default {
  name: "aiChat",
  setup() {
    const url = "ws://localhost:8092";
    const socket = ref();

    onMounted(() => {
      bus.on("startAiSchedule", () => {
        isScheduling.value = true;
        startWS();
      });
    });

    onUnmounted(() => {
      socket.value.onclose = () => {
        console.log("WebSocket disconnected");
      };
    });

    const isScheduling = ref(false);

    const autoSchedulingProgress = ref(0);

    const autoSchedulingStage = ref(0);

    const autoSchedulingProgressMessage = reactive([
      {
        stage: 1,
        message: "欢迎使用AI自动排课,正在添加排课任务。",
        isLoading: true,
        isShow: true,
        isProgressShow: false,
      },
      {
        stage: 2,
        message: "排课任务添加完毕,准备开始排课...",
        isLoading: false,
        isProgressShow: false,
        isShow: false,
      },
      {
        stage: 3,
        isLoading: false,
        message: "自动排课中...",
        isShow: false,
        isProgressShow: true,
      },
      {
        stage: 4,
        message: "正在等待排课结果。",
        isLoading: false,
        isProgressShow: false,
        isShow: false,
      },
      {
        stage: 5,
        message: "排课完成!",
        isLoading: false,
        isShow: false,
        isProgressShow: false,
      },
      {
        stage: 6,
        message: "本次排课结果:",
        isLoading: false,
        isShow: false,
        isProgressShow: false,
        resultData: "",
        isResultShow: true,
      },
      {
        stage: 7,
        errorMessage: "O^O",
        message: `排课失败! 原因:`,
        isLoading: false,
        isShow: false,
        isProgressShow: false,
      },
    ]);

    const HandleAutoScheduleProgress = () => {
      if (autoSchedulingStage.value >= 1) {
        if (autoSchedulingStage.value == 5 || autoSchedulingStage.value == 6) {
          console.log(autoSchedulingStage.value);
          autoSchedulingProgressMessage[
            autoSchedulingStage.value - 1
          ].isLoading = false;
          autoSchedulingProgressMessage[
            autoSchedulingStage.value
          ].isShow = true;
        } else {
          autoSchedulingProgressMessage[
            autoSchedulingStage.value - 1
          ].isLoading = false;
          autoSchedulingProgressMessage[
            autoSchedulingStage.value
          ].isShow = true;
          autoSchedulingProgressMessage[
            autoSchedulingStage.value
          ].isLoading = true;
        }
      } else {
        autoSchedulingProgressMessage[autoSchedulingStage.value].isShow = true;
        autoSchedulingProgressMessage[
          autoSchedulingStage.value
        ].isLoading = true;
      }
    };

    const initAutoScheduleMessage = () => {
      autoSchedulingProgress.value = 0;
      autoSchedulingStage.value = 0;
      autoSchedulingProgressMessage.forEach((msg) => {
        msg.isLoading = false;
        msg.isShow = false;
      });
    };

    const testimporve = () => {
      autoSchedulingStage.value++;
      HandleAutoScheduleProgress();
    };

    const startWS = () => {
      socket.value = new WebSocket(url);
      socket.value.onopen = () => {
        socket.value.send(
          JSON.stringify({
            stage: 0,
          })
        );
      };
      socket.value.onmessage = (event) => {
        let data = JSON.parse(event.data);
        autoSchedulingStage.value = data.index;
        if (autoSchedulingStage.value === 2) {
          autoSchedulingProgress.value = data.data.progress;
        }
        if (autoSchedulingStage.value === 5) {
          autoSchedulingProgressMessage[5].resultData = data.data.courses;
        }
        if (autoSchedulingStage.value === 6) {
          autoSchedulingProgressMessage[6].errorMessage = data.data.details;
        }
        HandleAutoScheduleProgress();
      };
    };

    const HandleResultDownLoad = () => {};

    return {
      autoSchedulingProgressMessage,
      testimporve,
      initAutoScheduleMessage,
      autoSchedulingProgress,
      isScheduling,
      startWS,
      HandleResultDownLoad
    };
  },
};
</script>

<style scoped>
.scheduling {
  height: 500px;
  padding: 10px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
}

.schedulingTitle {
  font-size: 20px;
  font-weight: bold;
}

.schedulingContent {
  margin: 10px 5px;
}
.schedulingText {
  font-size: 17px;
  margin-top: 20px;
}

.chatCollapse {
  height: 450px;
}

.chartScrollBar {
  height: 375px;
  width: auto;
  padding: 10px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
}

.chatView {
  height: max-content;
  width: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chatMessage {
  height: max-content;
  width: max-content;
  margin: 15px 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
}

.chatAvatar {
  height: 40px;
  width: 40px;
  border-radius: 20px;
}

.chatTextBorder {
  width: auto;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 10px;
  border-radius: 4px;
  border: solid 1px #dcdfe6;
}

.chatText {
  width: 100%;
  height: max-content;
  justify-self: left;
  display: flex;
  flex-direction: row;
}

.chatLoading {
  width: 12px;
  height: 12px;
  margin-left: 10px;
  border: 2px solid #c5c4c4;
  border-top-color: transparent;
  border-radius: 100%;
  align-self: center;
  animation: circle infinite 0.75s linear;
}

.chatProgress {
  width: auto;
  min-width: 250px;
  margin-top: 10px;
}

.autoScheduleInfo {
  min-width: 350px;
  min-height: 100px;
  height: max-content;
  margin: 5px 0px;
  padding: 5px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
}
@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>