'use strict';

class Worker {
    constructor (worker) {
        this.busy = false;
        this.tasks = [];
        this.worker = worker;
    }

    _runNext() {
        const next = this.tasks.pop();
        if (next) {
            this._run(next);
        } else {
            this.busy = false;
        }
    }

    _run(task) {
        this.busy = true;
        this.worker.send(task.message);
        this.worker.once('message', (message) => {
            if (message.success) {
                task.resolve(message.reply);
            } else {
                task.reject(new Error(message.error));
            }
            this._runNext();
        });
    }

    schedule(message) {
        const promise = new Promise((resolve, reject) => {
            const task = {
                message: message,
                resolve: resolve,
                reject: reject
            };
            if (this.busy == false) {
                this._run(task);
            } else {
                this.tasks.push(task);
            }
        });
        return promise;
    }
}

function FunctionProxy(target, moduleProp) {
    const handler = {
        get: function (target, functionProp, receiver) {
            return function (args) {
                return target.schedule({
                    module: moduleProp,
                    function: functionProp,
                    args: args
                });
            }
        }
    }
    return new Proxy(target, handler);
}

function ModuleProxy(worker) {
    const handler = {
        get: function (target, moduleProp, receiver) {
            return FunctionProxy(target, moduleProp);
        }
    }
    return new Proxy(new Worker(worker), handler);
}

module.exports = ModuleProxy;