define(["jquery"], function ($) {
    var Animation = Class.extend({
        /**
         * @constructor
         */
        init() {
            this.isRunning = false
            if(Animation._onCreated)
                Animation._onCreated(this)
        },
        /**
         * @deconstructor
         */
        destroy(){
            this.stop()
            this._onAnimationStart = null
            this._onAnimationCompleted = null
            this._onRunningAnimation = null
        },

        start: function () {
            if(this.isRunning){
                this.reset()
            }
            this.isRunning = true
            if (this._onAnimationStart)
                this._onAnimationStart()
        },
        update: function (delta) {
            if (this.isRunning) {
                if (this._onRunningAnimation)
                    this._onRunningAnimation(delta)
                if (this.isCompleted()) {
                    this.complete()
                }
            }
        },
        reset(){

        },
        isCompleted(){
            return true;
        },
        complete() {
            this.isRunning = false
            if (this._onAnimationCompleted)
                this._onAnimationCompleted()
        },

        stop() {
            this.isRunning = false
        },
        pause() {
            this.isRunning = false
        },
        restart() {
            this.start()
        },
        resume: function () {
            this.isRunning = true
        },
        running(){
            return this.isRunning
        },

        onAnimationStart(callback) { this._onAnimationStart = callback },
        onAnimationCompleted(callback) { this._onAnimationCompleted = callback },
        onRunningAnimation(callback) { this._onRunningAnimation = callback },

    })
    Animation.onCreated = function(callback){this._onCreated = callback}.bind(Animation)
    return Animation

})