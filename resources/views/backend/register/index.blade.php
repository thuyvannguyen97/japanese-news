<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Admin EUP | Register</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.7 -->
    {!! HTML::style('backend/bower_components/bootstrap/dist/css/bootstrap.min.css') !!}
    {!! HTML::style('backend/bower_components/font-awesome/css/font-awesome.min.css') !!}
    {!! HTML::style('backend/bower_components/Ionicons/css/ionicons.min.css') !!}
    {!! HTML::style('backend/dist/css/AdminLTE.min.css') !!}
    <!-- iCheck -->
    {!! HTML::style('backend/plugins/iCheck/square/blue.css') !!}

    <!-- Google Font -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
</head>
<body class="hold-transition login-page">
    <div class="register-box">
        <div class="register-logo">
            <a href="#"><b>Admin</b>EUP</a>
        </div>
        
        <div class="register-box-body">
            <p class="login-box-msg" style="{{ (isset($msgClass)) ? 'color: '.$msgClass : '' }}">{{ (isset($message)) ? $message : 'Register a new membership' }}</p>
            <form action="{{ route('admin.register') }}" method="post">
                <input type="hidden" name="_token" value="{{ csrf_token() }}"> 
                <div class="form-group has-feedback box-name">
                    <input type="text" class="form-control" placeholder="Full name" name="name">
                    <span class="glyphicon glyphicon-user form-control-feedback"></span>
                </div>
                <div class="form-group has-feedback box-email">
                    <input type="email" class="form-control" placeholder="Email" name="email">
                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                </div>
                <div class="form-group has-feedback box-pass">
                    <input type="password" class="form-control" id="pass-err" placeholder="Password" name="password">
                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>
                <div class="form-group has-feedback box-re-pass">
                    <input type="password" class="form-control" id="re-pass-err" placeholder="Retype password" name="re-password">
                    <span class="glyphicon glyphicon-log-in form-control-feedback"></span>
                </div>
                <div class="row">
                    <div class="col-xs-8">
                        <div class="checkbox icheck">
                            <label>
                            <input type="checkbox"> I agree to the <a href="#">terms</a>
                            </label>
                        </div>
                    </div>
                    <!-- /.col -->
                    <div class="col-xs-4">
                        <button type="submit" class="btn btn-primary btn-block btn-flat" id="register">Register</button>
                    </div>
                    <!-- /.col -->
                </div>
            </form>
        
            <a href="{{ route('admin.login') }}" class="text-center">I already have a membership</a>
        </div>
        <!-- /.form-box -->
    </div>
    <!-- /.login-box -->

    <!-- jQuery 3 -->
    {!! HTML::script('backend/bower_components/jquery/dist/jquery.min.js') !!}
    {!! HTML::script('backend/bower_components/bootstrap/dist/js/bootstrap.min.js') !!}
    <!-- iCheck -->
    {!! HTML::script('backend/plugins/iCheck/icheck.min.js') !!}
<script>
    $(function () {
        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' /* optional */
        });

        $('#register').click(function(){
            var name = $('input[name=name]').val();
            var email = $('input[name=email]').val();
            var password = $('input[name=password]').val();
            var re_password = $('input[name=re-password]').val();

            if(name == '' || name == null){
                $('.box-name').addClass('has-error');
                $('.box-name input').focus();
                return false;
            }else{
                if($('.box-name').hasClass('has-error')){
                    $('.box-name').removeClass('has-error');
                }
            }
            if(email == '' || email == null){
                $('.box-email').addClass('has-error');
                $('.box-email input').focus();
                return false;
            }else{
                if($('.box-email').hasClass('has-error')){
                    $('.box-email').removeClass('has-error');
                }
            }
            if(password == '' || password == null || (password.length < 6)){
                $('.box-pass').addClass('has-error');
                $('.box-pass input').focus();
                return false;
            }else{
                if($('.box-pass').hasClass('has-error')){
                    $('.box-pass').removeClass('has-error');
                }
            }
            if(password != re_password){
                $('.box-re-pass').addClass('has-error');
                $('.box-re-pass input').focus();
                return false;
            }else{
                if($('.box-re-pass').hasClass('has-error')){
                    $('.box-re-pass').removeClass('has-error');
                }
            }

            return true;
        })
    });
</script>
</body>
</html>
