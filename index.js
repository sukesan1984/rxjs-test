import Rx from 'rx'

// http://stackoverflow.com/questions/21667824/trying-to-make-my-own-rxjs-observable
var getAccessToken = (function (){
    return function (callback) {
        setTimeout(function(){
            callback(undefined, "some access token");
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

getAccessTokenObservable
    //.repeat()
    //.take(11)
    .subscribe(
        (x) => { console.log('next', x); },
        (err) => { console.log('error', err); },
        () => { console.log('done'); }
    );

(getAccessToken())( () => {});
