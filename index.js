import Rx from 'rx'

// http://stackoverflow.com/questions/21667824/trying-to-make-my-own-rxjs-observable
var getAccessToken = (function (){
    return function (callback) {
        console.log("start getAccessToken");
        setTimeout(function(){
            console.log("end getAccessToken");
            callback(undefined, "valid");
        }, 5);
    };
});

var getSomeApiAccessWithAccessToken = (function (accessToken, apiName) {
    return function(callback){
        console.log("start " + apiName);
        setTimeout(function(){
            console.log("end " + apiName);
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
        if(err){
            observable.onError(err);
        } else {
            observable.onNext(val);
            observable.onCompleted();
        }
    });
});

var getSomeApiAccessWithAccessTokenObservable = (accessToken, apiName) => {
    return Rx.Observable.create(function (observable){
        (getSomeApiAccessWithAccessToken(accessToken, apiName))(function(err, val){
            if(err){
                observable.onError(err);
            } else {
                observable.onNext(val);
                observable.onCompleted();
            }
        });
    });
};

var observable = getAccessTokenObservable
    .share();

observable
    .flatMap((accessToken) => {
        return getSomeApiAccessWithAccessTokenObservable(accessToken, "A");
    })
    .subscribe(
        (result) => { console.log('next1', result); },
        (err) => { console.log('error', err); },
        () => { console.log('done'); }
    );

observable
    .flatMap((accessToken) => {
        return getSomeApiAccessWithAccessTokenObservable(accessToken, "B");
    })
    .subscribe(
        (result) => { console.log('next2', result); },
        (err) => { console.log('error', err); },
        () => { console.log('done'); }
    );


