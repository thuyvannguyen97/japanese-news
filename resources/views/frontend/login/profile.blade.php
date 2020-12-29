@extends('frontend.layouts.master')

<!DOCTYPE html>
<html>
<head>
<style>
    #footer{
        margin-left: -82px;
    }
</style>
</head>
</html>

@section('after-script')
<script type="text/javascript">
   $(function(){
        $('.profile-save').click(function(){
        var name = $('#profile-name').html();
        var phone = $('#profile-phone').html();
        var email = $('#profile-email').html();
        var image = $('#input-avatar')[0].files[0];
        

              var data = {
                    name : name,
                    phone : phone,
                    email : email,
                    image: image
                }
                
                console.log(data)

        $.ajax({
          url: "{{ route('creatProfile') }}",
          type: 'POST',
          data: {
             
              name:name
          },
          processData: false,  // tell jQuery not to process the data
          contentType: false,
          headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
          success: function(res){
          }
      })
    
    })
   })
   
</script>

@endsection

@section('main-content')
<div class="container bootstrap snippet">
    <div class="row">
  		<div class="col-sm-10"><h1>User name</h1></div>
    </div>
    @foreach($profile as $item)
    <form class="form" action="{{ route('creatProfile') }}" method="post" id="registrationForm" enctype="multipart/form-data">
    <div class="row">
  		<div class="col-sm-3"><!--left col-->
            <div class="text-center">
                <img src="../frontend/images/{{ $item->image }}" id="avatar-img" class="avatar img-circle img-thumbnail" alt="">
                <h6>Upload a different photo...</h6>
                <input type="file" id="input-avatar" name="image"  accept="image/x-png,image/gif,image/jpeg" />
            </div><hr><br>
        </div><!--/col-3-->
    	<div class="col-sm-9">
            <div class="tab-content">
                <div class="tab-pane active" id="home">
                @if(!empty(Session::get('mess')))
                    <div class="alert alert-success" role="alert">
                    {{ Session::get('mess') }}
                    </div>
                @endif
               
                    <div class="box-body">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}" /> 
                        
                        <div class="form-group-profile">
                            <label class="title">Name</label>
                            <input type="text" class="form-control auto-furi" id="profile-name" name="name" contenteditable="true" placeholder="enter your name" value="{{ $item->name }}"/>
                        </div>
                        
                        <div class="form-group-profile">
                            <label>Email</label>
                            <input class="form-control none-resize auto-furi" id="profile-email" name="email"  contenteditable="true"  placeholder="enter your email" value="{{ $item->email }}"/>
                        </div>
                        <div class="form-group-profile">
                            <label>Phone</label>
                            <input class="form-control auto-furi" id="phone" name="profile-phone"  contenteditable="true"  placeholder="enter your phone number" value="{{ $item->phone }}" />
                        </div>
                    </div>
                        
                    <div class="form-group">
                        <div class="col-xs-12">
                            <br>
                            <button class="btn-lg btn-success" type="submit"><i class="glyphicon glyphicon-ok-sign"></i> Save</button>
                        </div>
                    </div>
                
                <hr>
            </div><!--/tab-pane-->
        </div><!--/tab-content-->

    </div><!--/col-9-->
    </form>
@endforeach
</div><!--/row-->

    @endsection