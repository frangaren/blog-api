const awaitsemaphore = require('await-semaphore');

function FunctionProxy(target, moduleProp) {
    const handler = {
        get: function (target, functionProp, receiver) {
            return function (args) {
                const promise = new Promise((resolve, reject) => {
                    target.mutex.acquire().then((release) => {
                        target.worker.once('message', function (msg) {
                            release();
                            if (msg.success) {
                                resolve(msg.reply);
                            } else {
                                reject(msg.error);
                            }
                        });
                        target.worker.send({
                            module: moduleProp,
                            function: functionProp,
                            args: args
                        });
                    });
                });
                return promise;
            }
        }
    }
    return new Proxy(target, handler);
}

function ModuleProxy(worker) {
    const target = {
        worker: worker,
        mutex: new awaitsemaphore.Mutex()
    };
    const handler = {
        get: function (target, moduleProp, receiver) {
            return FunctionProxy(target, moduleProp);
        }
    }
    return new Proxy(target, handler);
}

module.exports = ModuleProxy;