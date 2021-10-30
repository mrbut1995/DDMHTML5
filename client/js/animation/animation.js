define(["jquery"], function ($) {
    var Animation = Class.extend({
        init() {
            this.isRunning = false
            this.interval = 0
            this.time = 0

            if(Animation._onCreated)
                Animation._onCreated(this)
        },
        onAnimationStart(callback) { this._onAnimationStart = callback },
        onAnimationCompleted(callback) { this._onAnimationCompleted = callback },
        onRunningAnimation(callback) { this._onRunningAnimation = callback },

        start: function () {
            this.isRunning = true
            if (this._onAnimationStart)
                this._onAnimationStart()
            this.time = this.interval
        },
        update: function (delta) {
            if (this.isRunning) {
                if (this._onRunningAnimation)
                    this._onRunningAnimation(delta)
                this.time -= delta
                if (this.time <= 0) {
                    this.complete()
                }
            }
        },
        complete: function () {
            this.isRunning = false
            this.time = 0
            if (this._onAnimationCompleted)
                this.onAnimationCompleted()
        },

        stop: function () {
            this.isRunning = false
            this.time = 0
        },
        pause: function () {
            this.isRunning = false
        },
        restart() {
            this.start()
        },
        resume: function () {
            this.isRunning = true
        },
        percent: function () {
            if (!this.isRunning)
                return 1;
            if (this.interval <= 0)
                return 0;
            return 1 - (this.time / this.interval)
        }
    })
    Animation.onCreated = function(callback){this._onCreated = callback}.bind(Animation)
    return Animation

})