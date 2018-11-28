<template>
    <div class="main">
        <canvas ref="hiddenCanvas" width="0" height="0" style="display: none"></canvas>
        <div class="barrage-area">
            <canvas id="canvas" ref="canvas" :width="cWidth" :height="cHeight"
                    :style="{'width': cWidth/2 + 'px',
                'height': cHeight/2 + 'px', 'border': '1px solid #eee'}">
            </canvas>
        </div>
        <div class="bottom">
            <label class="my-switch" for="dm">
                <input type="checkbox" id="dm" v-model="dmStatus">
                <span>{{dmStatus ? '开启' : '关闭'}}</span>
            </label>
            <div class="color-setting">
                <span class="placeholder">#</span>
                <input type="text" placeholder="设置颜色" v-model="color">
                <span class="color" :style="{'background': '#' + color}"></span>
            </div>
            <div class="input-wrap">
                <input type="text" @keyup.enter="sent" v-model="dmInput" maxlength="20">
                <button type="button" @click="sent">发射</button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'Main',
  data () {
    return {
        dmArr: [], // 缓存弹幕数据的数组
        dmInput: '',
        color: '',
        dmStatus: true,
        cWidth: 0,
        cHeight: 0,
        timer: null,
        canvas: null,
        speed: 8
    };
  },
  watch: {
    dmStatus: function(val) {
        if (val) {
            this.start();
        } else {
            this.stop();
        }
    }
  },
  methods: {
    start () {
        this.timer = setInterval(() => {
            this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
            this.ctx.save();
            this.ctx.font = '30px Microsoft YaHei';
            if (!this.dmArr.length) this.stop();
            for (let i = 0, len = this.dmArr.length; i < len; i++) {
                let dm = this.dmArr[i];
                let overRange = dm.text && -this.ctx.measureText(dm.text).width;
                dm.x -= dm.speed;
                if (dm.x < overRange) {
                    this.dmArr.splice(i, 1);
                    continue;
                }
                this.ctx.fillStyle = `#${dm.color}`;
                this.ctx.fillText(dm.text, dm.x, dm.y);
            }
            this.ctx.restore();
        }, 20);
    },
    getY () {
        let range = Math.floor(this.cHeight / 50); // 跑道数量
        return Math.floor(Math.random() * range + 1) * 50;
    },
    getSpeed () {
        // 8-12
        return this.speed;
        // return Math.floor(Math.random() * 5) + 8;
    },
    getColor () {
        return `${Math.floor(Math.random() * 16777215).toString(16)}`;
    },
    pushDm (text, color) {
        let y = this.getY(); // 先确定跑道
        let x = this.cWidth; // 初始位置
        let delayWidth = 0;
        for (let i = 0, len = this.dmArr.length; i < len; i++) {
            let dm = this.dmArr[i];
            if (y === dm.y) { // 如果是同跑道,则往后排
                delayWidth += Math.floor(this.$refs.hiddenCanvas.getContext('2d').measureText(dm.text).width * 4 + 50);
            }
        }
        this.dmArr.push({
            text: text,
            x: x + delayWidth,
            y: y,
            speed: this.getSpeed(),
            color: color || this.getColor()
        });
    },
    sent () {
        if (!this.dmInput) {
            return;
        }
        this.stop();
        this.pushDm(this.dmInput, this.color);
        this.start();
        this.dmInput = '';
    },
    stop () {
        clearInterval(this.timer);
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
    },
    initData () {
        for (let i = 0; i < 30; i++) {
            this.pushDm(`It's barrage ${i}`);
        }
    }
  },
  mounted () {
    this.cWidth = document.body.clientWidth * 2;
    this.cHeight = (document.body.clientHeight - 50) * 2;
    this.ctx = this.$refs.canvas.getContext('2d');
    this.initData();
    this.start();
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    @green: #3eaf7c;
    body {
        margin: 0;
        padding: 0;
    }

    button, input {
        outline: none;
    }

    button {
        cursor: pointer;
    }

    .barrage-area {
        width: 100vw;
        height: calc(~'100vh - 50px');
    }
    .my-switch{
        width: 80px;
        margin-right: 10px;
        vertical-align: middle;
        height: 24px;
        display: flex;
        align-items: center;
        color: #fff;
        input {
            display: inline-block;
            outline: none;
            margin: 0;
            padding: 0;
            -webkit-appearance: none;
            background: #fff;
            border-radius: 20px;
            width: 40px;
            height: 100%;
            position: relative;
            border: none;
            margin-right: 5px;
            &:after{
                content: '';
                position: absolute;
                z-index: 1;
                display: inline-block;
                border-radius: 100%;
                left: 2px;
                top: 2px;
                background: red;
                width: 20px;
                height: 20px;
            }
            &:checked:after{
                left: auto;
                right: 2px;
                background: @green;
            }
        }
    }
    .main {
        .bottom {
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 2;
            width: 100%;
            height: 50px;
            background: @green;
            padding: 0 20px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .color-setting{
                margin-right: 10px;
                position: relative;
                input{
                    -webkit-appearance: none;
                    height: 30px;
                    line-height: 30px;
                    border-radius: 4px;
                    border: none;
                    outline: none;
                    padding: 0 15px 0 18px;
                    font-size: 14px;
                }
                .placeholder{
                    position: absolute;
                    left: 5px;
                    top: 5px;
                    z-index: 2;
                }
                .color{
                    position: absolute;
                    right: 5px;
                    top: 9px;
                    z-index: 2;
                    width: 13px;
                    height: 13px;
                    border-radius: 100%;
                }
            }
            .input-wrap {
                flex: 1;
                height: 36px;
                border-radius: 50px;
                background: #256b4b;
                display: flex;
                align-items: center;
                input[type=text] {
                    -webkit-appearance: none;
                    height: 100%;
                    line-height: 100%;
                    border: none;
                    outline: none;
                    padding: 0 16px 0 30px;
                    font-size: 16px;
                    flex: 1;
                    background: transparent;
                }
                button {
                    width: 80px;
                    border-radius: 0 50px 50px 0;
                    height: 100%;
                    border: none;
                    padding: 0;
                    font-size: 16px;
                    background: #2a6148;
                    color: #fff;

                }
            }
        }
    }
</style>
