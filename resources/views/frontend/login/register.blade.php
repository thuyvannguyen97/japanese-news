@extends('frontend.layouts.master')
@yield('before-css')
{!! HTML::style('frontend/css/index.css') !!}

@section('main-content')
<div class="container-fluid">
    <div class="row justify-content-md-center">
        <div class="col col-md-7 account-info">
            <div class="text-center">
                <p class="title">Đăng ký</p>
                <p class="note"><b>Bạn chưa có tài khoản, hãy tạo một tài khoản nhé</b></p>
                @if(isset($mess))
                    <div class="register-success">
                    {{ $mess }}
                    </div>
                @endif
            </div>
            <div class="row login-email">
                <div class="col-md-2"></div>
                <div class="col-md-8 arrow-container">
                    <form action="{{ route('addUser') }}" method="post">
                        {{ csrf_field() }}
                        <div class="form-group{{ $errors->has('name') ? ' has-error' : '' }} al_left">
                            <img class="ic-input" src="frontend/images/icon/ic_user.png"/>
                            <input type="text" id="name" class="form-control" name="name" placeholder="Họ và tên" value="{{ old('user') }}" required autofocus>
                           
                            @if ($errors->has('name'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('name') }}</strong>
                                </span>
                            @endif
                        </div>

                        <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }} al_left">
                            <img class="ic-input" src="frontend/images/icon/ic_email.png"/>
                            <input type="email" id="email" class="form-control" name="email" placeholder="Email của bạn" value="{{ old('email') }}" required>
                            
                            @if ($errors->has('email'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                            @endif
                        </div>

                        <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }} al_left">
                            <img class="ic-input" src="frontend/images/icon/ic_pass.png"/>
                            <input type="password" id="password" class="form-control" name="password" placeholder="Mật khẩu" required>

                            @if ($errors->has('password'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                            @endif
                        </div>

                        <div class="form-group al_left">
                            <img class="ic-input" src="frontend/images/icon/ic_pass.png"/>
                            <input id="password-confirm" type="password" class="form-control" name="password-repeat" placeholder="Nhập lại mật khẩu" required>
                        </div>

                        <button type="submit" class="btn btn-primary">Đăng ký</button>
                    </form>
                </div>
                <div class="col-md-2"></div>
            </div>
            <div class="row signup-form">
                <div class="col-md-8 signup">
                    <p>Bạn đã có tài khoản <a href="/login">Đăng nhập</a></p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection