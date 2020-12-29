@extends('frontend.news.layout')

@section('after-script')
    {{-- {!! HTML::script('frontend/js/common.js') !!} --}}
    <script type="text/javascript">
        $(function(){
            var id = '{{$id}}'; 
               
            $('#'+id).css({"background-color": "#d9d9d9"});
            var url = '{{route('web.dict')}}';
            clickDict(url);
            

            $('.submit-comment-rep').click(function(){
                var commentId = $('#cmt-rep').data("id")
                console.log(commentId)
            })

            $("#img-cmt").change(function(){
                readURL(this);
            });

            function readURL(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    
                    reader.onload = function (e) {
                        $('#img-view-cmt').attr('src', e.target.result);
                    }
                    
                    reader.readAsDataURL(input.files[0]);
                }
            }
            $('#like').click(function(){
                $('$like').css('color', 'rgb(32, 120, 244);');
            })

            $('.new-comt').keyup(function(e){
                if(e.keyCode == 13){
                    var new_mess = $(this).val();
                    var parent_id = $(this).attr("data-id") ? $(this).attr("data-id") : 0;
                    var parent_content = $(this).parent().parent();
                    var image = parent_content.find("#img-cmt").val();

                    if(new_mess != ""){
                        $.ajax({
                            url: "{{ route('add-comment') }}",
                            type: 'POST',
                            data: {
                                "new_mess": new_mess,
                                "parent_id": parent_id,
                                "new_id": id
                            },
                            headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                            success: function(res){
                                boxNewCmt = ``
                                boxNewCmt += `<div class="row">
                                                <div><img src="../frontend/images/`+res.image+`" class="user-image"></div>
                                                <div class="row user-comment">`
                                boxNewCmt +=        `<div class="nick-user">`+res.name+`</div>
                                                    <div class="content-comment" style="max-width: 532px;">`+ new_mess +`</div>
                                                </div>
                                            </div>`
                                boxInput = ``;
                                boxInput +=`<input type="text" name="new-comment-rep" class="new-comt" id="cmt-rep" placeholder="Viết bình luận..."></div>`;
                                $('.boxInput').html(boxInput)
                            if (parent_id == 0) {
                            boxNewCmt +=   `<div class="row like-cmt">
                                                <span id="comment">Trả lời</span>
                                            </div>`
                            }
                        

                                if (parent_id == 0) {
                                    $('.aaaa').html(boxNewCmt);
                                }
                                else{
                                    $('.rep-'+parent_id).html(boxNewCmt)
                                }
                                            
                            },
                            error: function(e) {
                                console.log(e);
                            }
                        });
                                
                    }
                }
            });

            $(".choose-image").on('click', function(){
                $("#img-cmt").click();
            });

        });

        
    </script>
@endsection

@section('main-content')
<div class="col-md-8">
    <div id="detail">
        <div class="row" id="img">
            @if(($detail->video)!=null)
                <video id="#" class="video-js vjs-default-skin" controls width="783" height="268"  preload="auto" src="{!! $detail->video !!}" data-setup='{ "playbackRates": [0.5, 1, 1.5, 2] }'>
                </video>
            @else
                <img src="{!!$detail->image !!}" alt="" class="" />
            @endif
        </div>
        <div class="row">
            <div  id="h3-bold-detail">{!! $detail->title !!}</div>
        </div>
        <div class="row"> <p>{!! $detail->pubDate !!}</p></div>   
    
        <div class="row" id="text">{!! $detail->content !!}</div>
        <div class="text-center">
            <a class="btn-dictionary btn-translate" href="{{ route('web.news.ajax.translate', ['id'=>$id]) }}" data-id="{{ $id }}">{{ trans ('lable.translation')}}</a>
        </div>

        <div class="box-comment">
            @foreach($comment as $co)
                @if($co->parent_id == 0)
                <div class="li-comment">
                    <div class="">
                        <img src="{{ $co->image }}" class="user-image">
                        <div class="user-comment">
                            <div class="nick-user">{{ $co->name }}</div>
                            <div class="content-comment">{{ $co->content }}</div>
                        </div>
                    </div>
                    <div class="like-cmt">
                        <!-- <span id="like">Thích  </span> -->
                        <span id="comment">Trả lời</span>
                    </div>
                    
                    <div class="like-comment">
                        @foreach($comment as $comt)
                        @if($comt->parent_id == $co->id)
                        <div class="">
                            <img src="{{ $comt->image }}" class="user-image" onerror="this.src='{{ url('/frontend/images/ic_avatar.png') }}' ">
                            <div class="user-comment">
                                <div class="nick-user">{{ $comt->name }}</div>
                                <div class="content-comment">{{ $comt->content }}</div>
                            </div>
                        </div>
                        @endif
                        @endforeach
                        <div class="rep-{{ $co->id }}"></div>
                        <div class="reply-comment">
                            @if(isset( Auth::guard('admin')->user()->image ))
                            <img src="../frontend/images/{{ Auth::guard('admin')->user()->image }}" class="user-image">
                            @else
                            <img src="{{ url('/frontend/images/ic_avatar.png') }}" class="user-image">
                            @endif
                            <div class="li-comment-new">
                                <div class="box-input">
                                    <input type="text" name="new-comment-rep" class="new-comt" id="cmt-rep" placeholder="Viết bình luận..." data-id="{{ $co->id }}"></div>
                                <div>
                                <input type="file" id="img-cmt" name="image" accept="image/x-png,image/gif,image/jpeg" hidden />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                @endif
            @endforeach

            <div class="li-comment">
                @if(isset(Auth::guard('admin')->user()->image ))
                <img src="../frontend/images/{{ Auth::guard('admin')->user()->image }}" class="user-image" onerror="this.src='{{ url('/frontend/images/ic_avatar.png') }}' ">
                @else
                <img src="{{ url('/frontend/images/ic_avatar.png') }}" class="user-image">
                @endif
                <div class="li-comment-new">
                    <div class="box-input">
                        <input type="text" name="new-comment" class="new-comt" placeholder="Viết bình luận...">
                    </div>
                    <div >
                        <input type="file" id="img-cmt" name="image" accept="image/x-png,image/gif,image/jpeg" hidden />
                    </div>
                </div>
            </div>
        </div>
        <!-- modal -->
        @include('frontend.modal.dict')
        @include('frontend.modal.translate')
    </div>
</div> 

@endsection
