@extends('backend.layouts.master')

@section('title', 'Admin-Users')

@section('after-script-end')
    <script>
        $(function(){
            // change status active or deactive
            $('.js-active-change').change(function(){
                var status = $(this).val();
                var current = $(this);
                var id = $(this).data('id');
                $.ajax({
                    url: '{{ route("admin.active") }}',
                    type: 'post',
                    data: {
                        status: status,
                        id: id
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        if(res == 1){
                            current.val(Math.abs(status-1));
                            swal("Success!", "", "success");
                        }
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })
            
            // change role
            $('select[name=role]').change(function(){
                var role = $(this).val();
                var current = $(this);
                var id = $(this).data('id');
                
                $.ajax({
                    url: '{{ route("admin.changeRole") }}',
                    type: 'post',
                    data: {
                        role: role,
                        id: id
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        if(res == 1){
                            current.val(role);  
                            swal("Success!", "", "success");
                        }
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })
            
            // delete user
            $('.btn-delete-action').click(function(){
                var current = $(this);
                var id = $(this).data('id');

                $.ajax({
                    url: '{{ route("admin.deleteUser") }}',
                    type: 'post',
                    data: {
                        id: id
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        if(res == 1){
                            current.addClass('hidden');
                            swal("Success!", "", "success");
                        }
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })
        })
    </script>
@endsection
@section('breadcrumbs')
<section class="content-header">
    <h1>
        Trang chủ
    </h1>
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Trang chủ</a></li>
        <li class="active">Quản lý users</li>
    </ol>
</section>
@endsection

@section('main-content')
<div class="box box-info">
    <div class="box-header with-border">
        <h3 class="box-title">Danh sách users</h3>
        <div class="box-tools">
            <form method="GET" action="">
                <div class="input-group" style="width: 200px;">
                    <input type="text" name="search" class="form-control input-sm pull-right" placeholder="Nhập tên">
                    <div class="input-group-btn">
                    <button type="submit" class="btn btn-sm btn-default"><i class="fa fa-search"></i></button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="box-body">
        <div class="row">
            <div class="col-sm-12">
                <table class="table table-striped table-bordered table-hover tbl-vertical-middle">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Ngày đăng ký</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $key => $user)
                            <tr>
                                <td>{{ $key + 1 }}</td>
                                <td>{{ $user->name }}</td>
                                <td>{{ $user->email }}</td>
                                <td>{{ $user->created_at }}</td>
                                <td>
                                    <a href="javascript:void(0)" class="btn btn-xs btn-danger btn-delete-action {{ ($user->status == -1) ? 'hidden' : ''}}" data-id="{{ $user->id }}">
                                        <i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Xóa tài khoản"></i>
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <!--Phân trang-->
        @include('backend.includes.pagination', ['data' => $users, 'appended' => ['search' => Request::get('search')]])
        <div class="clearfix"></div>
    </div>
</div>
@endsection