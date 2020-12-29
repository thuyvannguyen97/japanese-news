'use strict';

angular.module('mazii')

.controller('ChatController', ["$rootScope", "$scope", "$state", "localstoreServ", "authServ", "maziiServ", "dictUtilSer",
    function($rootScope, $scope, $state, localstoreServ, authServ, maziiServ, dictUtilSer) {

    $scope.tab_1 = 'menu-active';
    $scope.tabActive = 1;
    $scope.user = $rootScope.user;
    var user = $rootScope.user;

    $scope.listMessage = [];
    $scope.listUser = [];
    $scope.listmessageReceive = [];
    $scope.listMessagePrivate = [];
    $scope.countMessage = 0;
    $scope.newMessage = false;
    $scope.formChat = {};
    $scope.loadDone = false;
    $scope.tabScreen = 0;
    $scope.titleBar = 'Group';

    var showboxSetting = false;
    var socket = io.connect(SERVER_ADRESS);
    var listIdPravite = [];
    var indexMessagePublic = 0;
    var indexMessagePrivate = 0;
    var indexUser = 0;
    var previousKeycode;

    var getDataWhenLogined = function () {
        socket.emit('get-list-message-private-in-public', user);
        socket.emit('get-list-data');   
    }

    var scrollBottomListMessage = function () {
        $('.chat-public .list-message').animate({ scrollTop: 10000 }, 500);
    }

    var loadData = function () {
        user = $rootScope.user;
        $scope.user = $rootScope.user;
        if (typeof(user) == 'undefined' || user == null || user == '') {
            $scope.showLogin = true;
            console.log('not login');
        } else {
            $scope.showLogin = false;
            socket.emit('reset-socket-user', user);
            getDataWhenLogined();
            console.log('logined');
            // console.log($rootScope.user);
        }

    }

    if ($rootScope.user != null) {
        loadData();
        $scope.loadDone = true;
    } else {
        $scope.loadDone = true;
        $scope.showLogin = false;
    }

    $scope.changeTab = function (index) {
        $scope.tabActive = index;
        if (index == 1) {
            $scope.tab_1 = 'menu-active';
            $scope.tab_2 = $scope.tab_3 = '';
            $scope.tabScreen = 0;
            $('.main-chat .list-message li.list-group-item').removeClass('group-jlpt-active');
            $('.main-chat .list-message .group-0' + index).addClass('group-jlpt-active');
            $scope.titleBar = 'Group'
        } else if (index == 2) {
            $scope.tab_2 = 'menu-active';
            $scope.tab_1 = $scope.tab_3 = '';
            $scope.titleBar = 'Messages list';
            $scope.newMessage = false;
        } else {
            $scope.tab_3 = 'menu-active';
            $scope.tab_2 = $scope.tab_1 = '';
            $scope.titleBar = 'Users list';
            $scope.tabScreen = 7;
            $('.chat-list-user').scroll(function () {
                var height = $('.chat-list-user').scrollTop();
                if (height > 0 && height < 20) {
                    ++indexUser;
                    socket.emit('load-more-user', indexUser);
                }
            })
        }
    }

    $scope.changeScreen = function (index) {
        $scope.tabScreen = index;
        indexMessagePublic = 0;
        $('.main-chat .list-message li.list-group-item').removeClass('group-jlpt-active');
        $('.main-chat .list-message .group-' + index).addClass('group-jlpt-active');
        socket.emit('get-list-message-jltp', index);
        switch(index) {
            case 0:
                $scope.titleBar = 'Group'
                break;
            default:
                $scope.titleBar = 'JLPT' + index + ' group';
        }
    }

    $scope.loginFacebook = function () {
        authServ.loginFacebook().then(function (data) {
            if (data == null) {
                return;
            } else {
                socket.emit('user-join-public', data);
            }
            
        })
    }

    $scope.logoutFacebook = function () {
        authServ.logoutFacebook();
        user = $scope.user = $rootScope.user = null;
        loadData();
        resetDataWhenLogout();
        dictUtilSer.safeApply($scope);
    }

    var resetDataWhenLogout = function () {
        $scope.tab_1 = 'menu-active';
        $scope.tabActive = 1;

        $scope.listMessage = [];
        $scope.listUser = [];
        $scope.listmessageReceive = [];
        $scope.listMessagePrivate = [];
        $scope.countMessage = 0;
        $scope.newMessage = false;
        $scope.tabScreen = 0;

        var listIdPravite = [];
        var indexMessage = 0;
        var indexUser = 0;
    }

    socket.on('reset-socket-success', function (data) {
        user = data;
        $rootScope.user = user;
        $scope.user = user;
    })

    // Lấy thông tin khi người dùng đăng nhập thành công
    socket.on('login-success', function (data) {
        console.log(data);
        $rootScope.user = data;
        $scope.user = data;
        user = data;
        getDataWhenLogined();
        $scope.showLogin = false;
        dictUtilSer.safeApply($scope);
    })

    // Lấy danh sách tin nhắn của hệ thống
    socket.on('get-list-message', function (listMessage) {
        var size = listMessage.length;
        var index;
        $scope.listMessage = [];
        for (var i = 0; i < size; i++) {
            var index = listMessage[i].index;
            if (dictUtilSer.renderHtmlMessage(listMessage[i]).length > 1) {
                var dubMessage = dictUtilSer.renderHtmlMessage(listMessage[i]);
                var message = {
                    _id : listMessage[i]._id,
                    username : listMessage[i].username,
                    index : index,
                    message : dubMessage,
                    date_send : listMessage[i].date_send,
                    userId : listMessage[i].userId,
                    newLine : true
                }
            } else {
                var message = {
                    _id : listMessage[i]._id,
                    username : listMessage[i].username,
                    message : listMessage[i].content,
                    index : index,
                    date_send : listMessage[i].date_send,
                    userId : listMessage[i].userId,
                    newLine : false
                }
            }        
            $scope.listMessage.unshift(message);
        }

        dictUtilSer.safeApply($scope);
        if (index != 0) {
            $('#list-message-'+index).scroll(function () {
                var height = $('#list-message-'+index).scrollTop();
                if (height > 0 && height < 20) {
                    ++ indexMessagePublic;
                    socket.emit('load-more-message-jlpt', {
                        index : index , 
                        indexMessage : indexMessagePublic
                    });
                }
            })    
        }
        
        scrollBottomListMessage();
    })

    // Lấy danh sách người dùng của hệ thống
    socket.on('get-list-user', function (listUser) {
        var size = listUser.length;
        $scope.listUser = [];
        for (var i = 0; i < size; i++) {
            var e = listUser[i];
            if (user == null || e.fbId != user.fbId) {
                $scope.listUser.push(e);    
            }
        }
        dictUtilSer.safeApply($scope);
    })

    // Thêm người dùng đăng nhập
    socket.on('add-user-public', function (userAdd) {
        if (user == null || userAdd._id != user._id) {
            $scope.listUser.push(userAdd);
            dictUtilSer.safeApply($scope);
        }
        
    })

    // Nhận tin nhắn public
    socket.on('receive-message-public', function (msg) {
        if (dictUtilSer.renderHtmlMessage(msg).length > 1) {
            var dubMessage = dictUtilSer.renderHtmlMessage(msg);
            var message = {
                _id : msg._id,
                username : msg.username,
                index : msg.index,
                message : dubMessage,
                date_send : msg.date_send,
                userId : msg.userId,
                newLine : true
            }
            $scope.listMessage.push(message);
        } else{
            var message = {
                _id : msg._id,
                username : msg.username,
                message : msg.content,
                index : msg.index,
                date_send : msg.date_send,
                userId : msg.userId, 
                newLine : false
            }
            $scope.listMessage.push(message);
        }        
        scrollBottomListMessage();
        dictUtilSer.safeApply($scope);
    })

    $scope.formChat.sendChat = function (index) {
        sendMessage(index);
    }

    $scope.formChat.enterChat = function (event, index) {
        if (event.keyCode == 13) {
            if (!event.shiftKey) {
                sendMessage(index);   
                event.preventDefault();
            }
        }
    }

    var sendMessage = function (index) {
        var message = $('#enter-chat-message-' + index).val();
        var message = message.trim();
        if (message == null || message == '')
            return;

        if (user == null || user == '') {
            $scope.loginFacebook();
        } else {
            var msg = {
                user : $scope.user,
                message : message, 
                index : index
            };

            // Gửi tin nhắn tới server 
            socket.emit('send-message-public', msg);
            $('#enter-chat-message-' + index).val('');
        }
    }


    // Hàm nhận tin danh sách tin nhắn private từ server 
    socket.on('receive-list-message-private-in-public', function (message) {
        var size = $scope.listmessageReceive.length;
        if (size == 0) {
            $scope.listmessageReceive.push(message);
            listIdPravite.push(message.your_id);
        } else {
            for (var i = 0; i < size; i++) {
                // Kiểm tra xem tin nhắn này đã có người gửi trước chưa
                if (listIdPravite.indexOf(message.your_id) == -1) {
                    listIdPravite.push(message.your_id);
                    $scope.listmessageReceive.push(message);
                    $scope.newMessage = true;
                } else {
                    // Kiểm tra xem tin nhắn có bị trùng không
                    var size = $scope.listmessageReceive.length;
                    var k = 0;
                    for (var j = 0; j < size; j++) {
                        var e = $scope.listmessageReceive[i];
                        if (e.your_id == message.your_id) {
                            // Bị trùng
                            $scope.listmessageReceive[j] = message;
                            k++;
                        }
                    }
                    if (k == 0) {
                        // Không bị trùng
                        if (message.status == 0 && message.flag == 1) {
                            // Nếu tin nhắn chưa được đọc thì là tin nhắn mới
                            $scope.newMessage = true;
                        }
                        $scope.listmessageReceive.push(message);
                    }
                }
            }

        }

        for (var i = 0; i < $scope.listmessageReceive.length; i++) {
            $scope.newMessage = 0;
            if ($scope.listmessageReceive[i].status == 0) {
                $scope.newMessage == true;
            }
        }
        dictUtilSer.safeApply($scope);
    }); 

    // Chuyển sang màn hình pravite


    $scope.redirectChatPrivate = function (user) {
        $scope.userReceive = {
            _id : user._id,
            username : user.username
        }
        $scope.titleBar = 'Chat with ' + user.username;
        $scope.newMessage = false;
        $scope.tabScreen = 6;
        var data = {
            userSend : $scope.user,
            userReceive : $scope.userReceive
        }
        socket.emit('contruct-chat-private', {
            userReceive : $scope.userReceive,
            userSend : $scope.user,
        })

        socket.on('read-message-private', {
            userReceive : $scope.userReceive,
            userSend : $scope.user  
        })
        indexMessagePrivate = 0;
        dictUtilSer.safeApply($scope);
    }

    $scope.redirectChatPrivatetoDetailUser = function (message) {
        // Kích vào người dùng là mình không chuyển tới chat riêng
        if (message.userId == $scope.user._id)
            return;

        var user = {
            _id : message.userId,
            username : message.username
        }
        $scope.redirectChatPrivate(user);
    }

    $scope.redirectChatPrivatetoListMessage = function (message) {
        var user = {
            _id : message.your_id,
            username : message.your_username
        }
        $scope.redirectChatPrivate(user);

        if (message.status == 0) {
            $scope.newMessage = false; 
        }
    }   

    $scope.formChat.sendChatPrivate = function () {
        sendMessagePrivate();
    }

    $scope.formChat.enterChatPrivate = function (event) {
        if (event.keyCode == 13) {
            if (!event.shiftKey) {
                sendMessagePrivate();    
                event.preventDefault();
            }
        }
    }

    var sendMessagePrivate = function () {
        var message = $('#enter-chat-message-6').val();
        message = message.trim();
        if (message == null || message == '')
            return;

        var msg = {
            userSend : $scope.user,      
            userReceive : $scope.userReceive,
            message : message      
        }

        socket.emit('send-message-private', msg);

        $('#enter-chat-message-6').val().replace(/\n/g, "");
        $('#enter-chat-message-6').val('');
    }

    socket.on('get-more-message', function (listMessage) {
        if (listMessage == null || listMessage.length == 0)  
            return;
        
        $('.list-message-0').scrollTop(50);
        var size = listMessage.length;
        for (var i = 0; i < size; i++) {
            var msg = listMessage[i];
            if (dictUtilSer.renderHtmlMessage(listMessage[i]).length > 1) {
                var dubMessage = dictUtilSer.renderHtmlMessage(listMessage[i]);
                var message = {
                    _id : listMessage[i]._id,
                    username : listMessage[i].username,
                    index : listMessage[i].index,
                    message : dubMessage,
                    date_send : listMessage[i].date_send,
                    userId : listMessage[i].userId,
                    newLine : true
                }
            } else {
                var message = {
                    _id : listMessage[i]._id,
                    username : listMessage[i].username,
                    message : listMessage[i].content,
                    index : listMessage[i].index,
                    date_send : listMessage[i].date_send,
                    userId : listMessage[i].userId,
                    newLine : false
                }
            }        
            $scope.listMessage.unshift(message);
        }
        dictUtilSer.safeApply($scope);
    })

    socket.on('get-more-user', function (listUser) {
        if (listUser == null || listUser.length == 0)  
            return;
        
        var size = listUser.length;
        for (var i = 0; i < size; i++) {
            $scope.listUser.unshift(listUser[i]);
        }
        dictUtilSer.safeApply($scope);
    })

    socket.on('receive-load-more-message-private', function (listMessage) {
        if (listMessage.length == 0)
            return;

        $('.list-message-private').animate({ scrollTop: 100 }, 500);
        var size = listMessage.length;
        for (var i = 0; i < size; i++) {
            var message = listMessage[i];
            $scope.listMessagePrivate.unshift(message);
        }
        dictUtilSer.safeApply($scope);
    })

    //Nhận tin nhắn private
    socket.on('receive-message-pravite', function (msg) {
        // Kiểm tra xem tin nhắn mới nhận có là của người đã gửi không
        if (dictUtilSer.renderHtmlMessagePrivate(msg).length > 1) {
            msg.newLine = true;
            msg.message = dictUtilSer.renderHtmlMessagePrivate(msg);
        } else {
            msg.newLine = false;
        }
        $scope.listMessagePrivate.push(msg);
        $('.list-message-private').animate({ scrollTop: 10000 }, 500);
        var size = $scope.listmessageReceive.length;
        var k = 0;
        var last_message;
        for (var i = 0; i < size; i++) {
            var e = $scope.listmessageReceive[i];
            if (e.your_username == msg.your_username) {
                $scope.listmessageReceive[i] = msg;
                k++;
            }
        }
        if (k == 0) {
            $scope.listmessageReceive.push(msg);
        }

        // Thêm nhận biết là có tin nhắn mới. Kiểm tra xem tin nhắn cũ có là tin nhắn mới không. Nếu có thì không phải tăng nữa vì nó vẫn là tin nhắn mới
        if (msg.status == 0 && msg.flag == 1) {
            $scope.newMessage = true;
        }
        dictUtilSer.safeApply($scope);

    })

    // Lấy danh sách tin nhắn với người đang chat

    socket.on('receive-list-chat-private', function (data) {
        // Hàm đảo ngược vị trí các phần tử của mảng
        data.reverse();
        $scope.listMessagePrivate = data;
        dictUtilSer.safeApply($scope);
        $('.list-message-private').animate({ scrollTop: 10000 }, 500);
        $('#list-message-6').scroll(function () {
            var height = $('#list-message-6').scrollTop();
            if (height > 0 && height < 20) {
                ++ indexMessagePrivate;
                socket.emit('load-more-message-private', {
                    userReceive : $scope.userReceive,
                    userSend : $scope.user,
                    index : indexMessagePrivate
                });
            }
        })
    });


    $scope.$on('loadFBDone', function(){
        loadData();
        $scope.loadDone = true;
        dictUtilSer.safeApply($scope);
    });
    
    setTimeout(function () {
        $('#list-message-0').scroll(function () {
            var height = $('#list-message-0').scrollTop();
            if (height > 0 && height < 20) {
                ++ indexMessagePublic;
                socket.emit('load-more-message', indexMessagePublic);
            }
        })

    }, 2000);

    $scope.showDetailUser = function (id) {
        $('.detail-user-'+id).slideDown(100);
    }

    $('*').click(function(e) {
        var $target = $(e.target);
        if (!$(e.target).is(".avatar")) {
            $('.detail-user').slideUp(100);
        }
    })

    $scope.translateMessage = function (message, id) {
        if (typeof(message) == 'object') {
            message = message.toString();
            message = message.replace(/,/g, ' ');    
        }
        
        var e = $('.text-'+id+' > .trans');
        if (e.length != 0 || !e == null) 
            return;
        // Đã dịch rồi

        if (dictUtilSer.isJapanese(message)) {
            maziiServ.googleTranslate(message, 'ja', 'vi').then(function (data) {
                var tran = data.sentences[0].trans;
                tran = '<p class="trans">' + tran + '</p>';
                $('.text-'+id).append(tran);
            })
        } else {
            maziiServ.googleTranslate(message, 'vi', 'ja').then(function (data) {
                var tran = data.sentences[0].trans;
                tran = '<p class="trans">' + tran + '</p>';
                $('.text-'+id).append(tran);
            })
        }
    }

    sendGA('pageview', 'chat');

}]);
