<aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
          <img src="{{ url('backend/dist/img/user2-160x160.jpg')}}" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
          <p>{{ Auth::guard('admin')->user()->name }}</p>
          <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
        </div>
      </div>
	  <!-- sidebar menu: : style can be found in sidebar.less -->
	  @if(Auth::guard('admin')->user()->role == 1)
      <ul class="sidebar-menu" data-widget="tree">
        <li class="header">Quản Lý Users</li>
        <li class="{{ Request::is('admin/users') ? 'active' : '' }}">
            <a href="{{ route('admin.users') }}">
                <i class="fa fa-files-o"></i>
                <span>Quản lý users</span>
            </a>
        </li>
       
	  </ul>
	  @endif

      <ul class="sidebar-menu" data-widget="tree">
        <li class="header">Quản Lý Tài Nguyên</li>
        <li class="treeview {{ Request::is('admin/news*') ? 'active' : '' }}">
            <a href="#">
                <i class="fa fa-files-o"></i>
                <span>Báo Nhật</span>
                <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            <ul class="treeview-menu">
              <li class="{{ Request::is('admin/news') ? 'active' : '' }}"><a href="{{ route('admin.news') }}"><i class="fa fa-circle-o"></i> Viết báo tuần</a></li>
              <li class="{{ Request::is('admin/news-manager*') ? 'active' : '' }}"><a href="{{ route('admin.news.manager', 'new') }}"><i class="fa fa-circle-o"></i> Quản lý bài báo</a></li>
            </ul>
        </li>
        <li class=" {{ Request::is('admin/community-manager*') ? 'active' : '' }}">
        <a href="{{ route('admin.community-manager', ['cate' => 'all']) }}">
                <i class="fa fa-files-o"></i>
                <span>Quản lý cộng đồng</span>
        </a>
        </li>
  
    <!-- /.sidebar -->
  </aside>