@extends('backend.layouts.master')

@section('title', 'Admin-Users')

@section('after-script-end')
    <script>
        $(function(){
            $('.user-trans').click(function(){
                var user_id = $(this).data('id');
                var new_id = $(this).attr('id');
                
                $.ajax({
                    url: "{{ route('admin.trans-user-manager') }}",
                    type: 'GET',
                    data: {
                        user_id: user_id,
                        new_id: new_id
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        console.log(res)
                        var trans = `
                        <table class="table table-striped table-bordered table-hover tbl-vertical-middle">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Content</th>
                                </tr>
                            </thead>
                            <tbody>`
                            for (i = 0; i < res.length; i++) {
                                trans += `<tr>
                                            <td>`+ res[i].sentence_id+`</td>
                                            <td>`+ res[i].content+`</td>
                                        </tr> `                  
                                    
                            }
                                trans += `</tbody>
                                    </table>`
                            $('.boxTrans').html(trans)
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            })

            $('.changeFlag').click(function(){
                var id = $(this).attr('id');
                var status = $(this).data('id');
                var user_id = $(this).val();
                var current = $(this);
                status =  Math.abs(1-status);
                $.ajax({
                    url: "{{ route('backend.ajax.comment') }}",
                    type: 'post',
                    data: {             
                        id: id,
                        status: status,
                        user_id: user_id,
                        cate: 'sentence'
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        current.data('id', status);
                        current.removeClass((status == 0) ? 'btn-info' : 'btn-warning');
                        current.addClass((status == 1) ? 'btn-info' : 'btn-warning');
                        current.html((status == 1) ? '<i class="material-icons">Hiện</i>' : '<i class="material-icons">Ẩn</i>');
                    },
                    error: function(e) {
                        console.log();
                    }
                });
            });
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
        <li class="active">Quản lý user</li>
    </ol>
</section>
@endsection

@section('main-content')
<div class="box box-info">
    <div class="box-header with-border">
        <h3 class="box-title">User có bản dịch</h3>
    </div>
    <div class="box-body">
        <div class="row">
            <div class="col-md-4">
                <table class="table table-striped table-bordered table-hover tbl-vertical-middle">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Name</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $key => $user)
                            <tr>
                                <td>{{ $key + 1 }}</td>
                                <td data-id="{{ $user->user_id }}" class="user-trans" id="{{ $new_id }}">{{ $user->name }}</td>
                                <td><button class="btn btn-xs waves-effect changeFlag {{ ($user->active == 1) ? 'btn-info' : 'btn-warning' }}" type="button" data-id= "{{$user->active }}" id="{{ $new_id }}" value="{{ $user->user_id  }}"><i class="material-icons">{{ ($user->active == 1) ? 'Hiện' : 'Ẩn'}}</i></button></td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div class="col-md-8 boxTrans"></div>
        </div>
        <!--Phân trang-->
        @include('backend.includes.pagination', ['data' => $users, 'appended' => ['search' => Request::get('search')]])
        <div class="clearfix"></div>
    </div>
</div>


@endsection