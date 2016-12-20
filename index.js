import Rx from 'rx'

// http://stackoverflow.com/questions/21667824/trying-to-make-my-own-rxjs-observable
var getAccessToken = (function (){
    return function (callback) {
        setTimeout(function(){
            callback(undefined, "some access token");
        }, 5);
    };
});

var getSomeApiAccessWithAccessToken = (function (accessToken) {
    return function(callback(){
        setTimeout(function(){
            if(accessToken === "valid"){
                callback(undefined, "success");
            } else {
                callback("accessToken is invalid");
            }
        }, 1000);
    };
});


var getAccessTokenObservable = Rx.Observable.create(function (observable){
    (getAccessToken())(function(err, val){ 
        console.log("Hoge");
        if(err){
            observable.onError(err);
        } else {
            observable.onNext(val);
            observable.onCompleted();
        }
    });
});

getAccessTokenObservable
    .share()
    .subscribe(
        (accessToken) => { console.log('next', accessToken); },
        (err) => { console.log('error', err); },
        () => { console.log('done'); }
    );

(getAccessToken())( () => {});
