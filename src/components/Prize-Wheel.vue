<template>
  <div class="wheel-container">
    <canvas ref="wheelCanvas" width="500" height="500"></canvas>
    <button 
      id="spin" 
      :style="{ backgroundColor: spinButtonColor }"
    >
      {{ spinButtonText }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'PrizeWheel',
  props: {
    comments: Array
  },
  data() {
    return {
      PI: Math.PI,
      TAU: 2 * Math.PI,
      friction: 0.991,
      angVel: 0,
      ang: 0,
      dia: 500,
      ctx: null
    }
  },
  computed: {
    rad() {
      return this.dia / 2
    },
    arc() {
      return this.TAU / this.comments.length
    },
    currentIndex() {
      return Math.floor(this.comments.length - (this.ang / this.TAU) * this.comments.length) % this.comments.length
    },
    spinButtonText() {
      return this.comments[this.currentIndex].authorName
    },
    spinButtonColor() {
      return this.comments[this.currentIndex].color
    }
  },
  mounted() {
    this.ctx = this.$refs.wheelCanvas.getContext('2d')
    this.comments.forEach((sector, i) => this.drawSector(sector, i))
    this.rotate()
  },
  methods: {
    rand(m, M) {
      return Math.random() * (M - m) + m
    },
    drawSector(sector, i) {
      const angle = this.arc * i
      this.ctx.save()
      // Draw sector
      this.ctx.beginPath()
      this.ctx.fillStyle = sector.color
      this.ctx.moveTo(this.rad, this.rad)
      this.ctx.arc(this.rad, this.rad, this.rad, angle, angle + this.arc)
      this.ctx.lineTo(this.rad, this.rad)
      this.ctx.fill()
      // Draw text
      this.ctx.translate(this.rad, this.rad)
      this.ctx.rotate(angle + this.arc / 2)
      this.ctx.textAlign = 'right'
      this.ctx.fillStyle = '#fff'
      this.ctx.font = 'bold 30px sans-serif'
      this.ctx.fillText(sector.authorName, this.rad - 10, 10)
      this.ctx.restore()
    },
    rotate() {
      this.$refs.wheelCanvas.style.transform = `rotate(${this.ang - this.PI / 2}rad)`
    },
    frame() {
      if (!this.angVel) return
      this.angVel *= this.friction
      if (this.angVel < 0.002) this.angVel = 0
      this.ang += this.angVel
      this.ang %= this.TAU
      this.rotate()
    },
    engine() {
      this.frame()
      if (this.angVel > 0 || Math.abs(this.angVel) > 0.001) {
        requestAnimationFrame(this.engine)
      } else {
        this.$emit('get', this.currentIndex);
      }
    },
    handleSpinClick() {
        this.angVel = this.rand(0, 1)
        this.engine()
    }
  }
}
</script>

<style>
.wheel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: fit-content;
  margin-left: 20px;
}

canvas {
  transition: transform 0.1s;
}

#wheelOfFortune {
  display: inline-block;
  position: relative;
  overflow: hidden;
}

#wheel {
  display: block;
}

#spin {
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30%;
  height: 30%;
  margin: -15%;
  background: #fff;
  color: #fff;
  box-shadow: 0 0 0 8px currentColor, 0 0px 15px 5px rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  transition: 0.8s;
}

#spin::after {
  content: '';
  position: absolute;
  top: -17px;
  border: 10px solid transparent;
  border-bottom-color: currentColor;
  border-top: none;
}


</style>