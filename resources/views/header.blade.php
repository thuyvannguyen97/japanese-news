<nav class="navbar navbar-fixed-top not-mobile">
  <div class="container-fluid">
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
        <li>
          <a href="{{ url('news') }}">
            <b></b>
          </a>
        </li>
        <li class="{{ $news or ''}}">
          <a href="{{ url('news') }}">
            News
          </a>
        </li>
        <li class="{{ $search or '' }}">
          <a href="{{ url('search') }}">
            Dictionary
          </a>
        </li>
      </ul>
    </div><!--/.nav-collapse -->
  </div>
</nav>

<div class="menu-left not-web">
  <ul class="list-group">
    <li class="list-group-item text-logo">
      <img src="{{ url('app/imgs/mazii-logo.png') }}" class="logo-mazii">
    </li>
    <li class="list-group-item">
      <a href="">
        <i class="fa fa-paper-plane-o fa-fw fa-lg"></i> 
        News
      </a>
    </li>
    <li class="list-group-item">
      <a href="">
        <i class="fa fa-home fa-fw fa-lg"></i> 
        Dictionary
      </a>
    </li>
  </ul>
</div>