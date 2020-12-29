@extends('frontend.layouts.master')
@yield('before-css')
{!! HTML::style('frontend/css/index.css') !!}

@section('main-content')
<div class="container-fluid">
    <div class="row justify-content-md-center">
        <div class="col col-md-7 account-info">
            <div class="text-center">
                <p class="title">Đăng nhập</p>
                <p class="note"><b>Bạn chưa đăng nhập, xin mời đăng nhập</b></p>
            </div>
            <div class="row login-email">
                <div class="col-md-2"></div>
                <div class="col-md-8 arrow-container">
                    <form action="{{ route('checkLogin') }}" method="post">
                        {{ csrf_field() }}
                        <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }} al_left">
                            <img class="ic-input" src="frontend/images/icon/ic_email.png"/>
                            <input type="email" id="email" class="form-control" name="email" placeholder="Email của bạn" value="{{ old('email') }}" required autofocus>
                           
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

                        <div class="form-group">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> Remember Me
                                </label>
                            </div>
                        </div>
    
                        <button type="submit" class="btn btn-primary">Đăng nhập</button>
                    </form>
                </div>
                <div class="col-md-2"></div>
            </div>
            <div class="row signup-form">
                <div class="col-md-8 signup">
                    <p>Bạn chưa có tài khoản <a href="/register">Đăng ký</a></p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection