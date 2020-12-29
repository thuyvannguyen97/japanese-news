<div id="header">
    <div id="header-nav" class="d-flex flex-column flex-md-row align-items-center px-md-4">
        <button class="navbar-toggler btn-menu not-web" type="button" data-toggle="collapse" data-target="#nav-mobile" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        
        <h1 id="logo" class="my-0 mr-md-auto font-weight-normal"> 
            <a href="{{ route('web.easy.news', ['type' => 'easy']) }}" class="navbar-brand">JPN</a>
        </h1>
        <nav class="navbar navbar-expand-md navbar-dark">
            <ul id="nav" class="navbar-nav flex-row ml-md-auto d-none d-md-flex collapse navbar-collapse">
                <li class="nav-item {{(Request::is('news/easy*')|| isset($home)) ? 'active' : ''}}"><a class="nav-link" href="{{ route('web.easy.news', ['type' => 'easy']) }}">News</a></li>
                <!-- <li class="nav-item {{ (Request::is('news/normal*')|| isset($active)) ? 'active' : ''}}"><a class="nav-link" href="{{ route('web.normal.news', ['type' => 'normal']) }}">Normal News</a></li> -->
                <li class="nav-item {{ Request::is('community*')?'active':'' }}"><a class="nav-link" href="{{ route('web.community', ['topic'=>1]) }}">Community</a></li>
                <li class="nav-item {{Request::is('dictionary*') ? 'active' : ''}}"><a class="nav-link" href="{{ route('web.search')}}">Dictionary</a></li>
                <li class="nav-item n">
                    <a href="#" class="bg-color nav-setting"><i class="fas fa-cog icon-setting"></i></a>
                    <ul class="sub-menu">
                        <li><a class="sub-hira bg-color" href="#">
                            {{-- <img class="icons-setting" src="{{ url('frontend/images/hiragana.png') }}"> --}}
                            <p class="bg-color setting-furi-mb">{{ trans('lable.list_setting.furi') }}</p>
                            <select class="sl-custom select-showFuri">
                                <option value="jlpt-n1">Hiện</option>
                            <option value="jlpt-all">Ẩn</option>
                            </select></a>
                        </li>
                        <hr class="hr-setting">
                        <li><a class="bg-color"  href="#">
                            {{-- <img class="icons-setting" src="{{ url('frontend/images/font-size.png') }}"> --}}
                            <p class="bg-color setting-size">{{ trans('lable.list_setting.size') }}</p>
                            
                            <select class="size-options">
                                <option value="50%" class="size">12</option></option>
                                <option value="60%" class="size">13</option>
                                <option value="70%" class="size">14</option>
                                <option value="80%" class="size">15</option>
                                <option value="90%" class="size">16</option>
                                <option value="95%" class="size">17</option>
                            </select></a>
                            
                        </a>
                        </li>
                        
                    </ul>
                </li>   
                @if(isset( Auth::guard('admin')->user()->name ))
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        @if(Auth::guard('admin')->user()->image)
                        <img src="../frontend/images/{{ Auth::guard('admin')->user()->image }}" onerror="this.onerror=null;this.src='/frontend/images/user.png';" class="user-image">
                        @else
                        <img src="../frontend/images/user.png" class="user-image">
                        @endif
                    </a>
                    <ul class="dropdown-menu profile-user">
                        <li class="user-header" style="text-align: center;">
                            @if(Auth::guard('admin')->user()->image)
                            <img src="../frontend/images/{{ Auth::guard('admin')->user()->image }}" onerror="this.onerror=null;this.src='/frontend/images/user.png';" class="img-circle user-image-on" alt="User Image">
                            @else
                            <img src="../frontend/images/user.png" class="img-circle user-image-on" alt="User Image">
                            @endif

                        <p>
                            {{ Auth::guard('admin')->user()->name }}
                            <small>{{ Auth::guard('admin')->user()->created_at }}</small>
                        </p>
                        </li>
                        <li class="user-footer">
                        <div class="pull-left">
                            <a href="{{ route('web.profile') }}" class="btn btn-default btn-flat" style="color: #fff;">Profile</a>
                        </div>
                        <div class="pull-right">
                            <a href="{{ route('userLogout') }}" class="btn btn-default btn-flat" style="color: #fff;">Sign out</a>
                        </div>
                        </li>
                    </ul>
                </li>
                @else
                <li class="login-header">
                    <a href="{{ route('login') }}">Login</a>
                </li>
                @endif

            </ul>
        </nav>
    </div>  
 
    <ul id="nav-mobile" class="not-web collapse ">
        <li class="nav-item {{(Request::is('news/easy*')|| isset($home)) ? 'active' : ''}}"><a class="nav-link" href="{{ route('web.easy.news', ['type' => 'easy']) }}">Easy News</a></li>
        <li class="nav-item {{ (Request::is('news/normal*')|| isset($active)) ? 'active' : ''}}"><a class="nav-link" href="{{ route('web.normal.news', ['type' => 'normal']) }}">Normal News</a></li>
        <li class="nav-item {{Request::is('dictionary*') ? 'active' : ''}}"><a class="nav-link" href="{{ route('web.search')}}">Dictionary</a></li>
        <li class="nav-item n box-setting">
            <a href="#" class="nav-link">Setting</a>
            <ul class="sub-menu">
                <li><a class="sub-hira bg-color" href="#">
                    {{-- <img class="icons-setting" src="{{ url('frontend/images/hiragana.png') }}"> --}}
                    <p class="bg-color setting-furi-mb">{{ trans('lable.list_setting.furi') }}</p>
                    <select class="sl-custom select-showFuri-mb">
                        <option value="jlpt-n1">Hiện</option>
                        <option value="jlpt-all">Ẩn</option>
                    </select></a>
                </li>
                <hr class="hr-setting">
                <li><a class="bg-color"  href="#">
                    {{-- <img class="icons-setting" src="{{ url('frontend/images/font-size.png') }}"> --}}
                    <p class="bg-color setting-size-mb">{{ trans('lable.list_setting.size') }}</p>
                    
                    <select class="size-options-mb">
                        <option value="50%" class="size">14</option>
                        <option value="60%" class="size">16</option>
                        <option value="70%" class="size">18</option>
                        <option value="80%" class="size">20</option>
                        <option value="90%" class="size">22</option>
                        <option value="95%" class="size">24</option>
                    </select></a>
                    
                </a>
                </li>
                
            </ul>
        </li>        
    </ul>

</div>