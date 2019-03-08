const vm = new Vue({
  data() {
    return {
      number: 5,
      hit_number: 0,
      current_number: 0,
      pies: [],
      isSpinning: false,
      isStopping: false,
      spinAngle: 0,
      R: 100,
      G: 100,
      B: 100
    }
  },
  mounted() {
    this.createPies()
  },
  methods: {
    createPies() {
      this.pies = []

      this.current_number = this.number
      //colorbase
      const r = +this.R
      const g = +this.G
      const b = +this.B

      for (let i = 0; i < this.current_number; i++) {
        this.pies.push({
          number: i,
          baseangle: this.pieAngle * i,
          color: [
            Math.floor(Math.random() * (255 - r)) + r,
            Math.floor(Math.random() * (255 - g)) + g,
            Math.floor(Math.random() * (255 - b)) + b
          ].join(",")
        })
      }
    },
    async rouletteHandle() {
      //回ってたら止める
      if (this.isSpinning) {
        this.isStopping = true
      } else {
        // ルーレット開始
        this.isSpinning = true
        this.spinRoulette()
      }
    },
    async spinRoulette() {
      const calcEasing = (target, ease) => {
        let step_angle = 3
        return new Promise(resolve => {
          const id = setInterval(() => {
            this.spinAngle += step_angle
            if (this.spinAngle >= 360) {
              this.spinAngle = 0
            }

            if (this.isStopping) {
              step_angle -= (target + step_angle) * ease
              if (step_angle < target * 0.9) {
                clearInterval(id)

                this.pies.forEach(pie => {
                  let s_angle = pie.baseangle + this.spinAngle
                  let e_angle = s_angle + this.pieAngle
                  if (s_angle > 360) {
                    s_angle -= 360
                  }
                  if (e_angle > 360) {
                    e_angle -= 360
                  }

                  if (s_angle > e_angle) {
                    s_angle -= 360
                  }

                  if (s_angle <= 90 && e_angle >= 90) {
                    this.hit_number = pie.number
                    return
                  }
                })

                resolve()
              }
            }
          }, 1)
        })
      }
      //ルーレット停止までのイージング処理
      //イージングの公式
      //現在の値 += 目標値 - 現在の値 * イージング係数
      const ease = 0.0005
      const target = 0.5
      await calcEasing(target, ease)




      //終了処理
      this.isSpinning = false
      this.isStopping = true
    },
    reflesh() {
      this.createPies()
    }
  },
  computed: {
    pieAngle() {
      return 360 / this.current_number;
    },
  },
  el: "#app"
})
