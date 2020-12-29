@extends('frontend.layouts.master')

@section('after-script')
<script type="text/javascript">
   $(function(){
        
    $('.box-add-quest').click(function(){
        $('#addAnswer').modal('show');
    })

 
    $('.close-modal').click(function(){
        $('#addAnswer').css('display', 'none');
    })

    function addContact(user_id, community_id, comment_community_id, contact){
        $.ajax({
            url: "{{ route('contact') }}",
            type: 'GET',
            data: {
                user_id: user_id,
                community_id: community_id,
                comment_community_id: comment_community_id,
                contact: contact
            },
            headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
            success: function(res){
                console.log(res)
                
            },
            error: function(e) {
                console.log(e);
            }
        });
    }
    $('.comunity-like').click(function(){
        
        community_id = $(this).data('id')
        console.log(community_id)
        comment_community_id = 0;
        contact = 0;
        addContact( community_id, comment_community_id, contact);
       
    })

    $('.comment-action-container').click(function(){
       
        comment_community_id = $(this).data('id')
        community_id = 0;
        contact = 0;
        addContact( community_id, comment_community_id, contact);
       
    })

    $('.box-follow').click(function(){
        community_id = $(this).data('id')
        count = $('.count-follow-'+community_id).text();
        $.ajax({
            url: "{{ route('contact') }}",
            type: 'GET',
            data: {
                community_id: community_id
            },
            headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
            success: function(res){
                console.log(res)
                if(res[1] == 1){
                    $('.'+community_id).removeClass('community-follow');
                    $('.'+community_id).addClass('followed');
                    count++;
                    $('.count-follow-'+community_id).html(count);
                }else{
                    $('.'+community_id).removeClass('followed');
                    $('.'+community_id).addClass('community-follow');
                    count--;
                    $('.count-follow-'+community_id).html(count);
                }
                var navFollow = ``;
                for (i = 0; i < res[0].length; i++) {
                    navFollow += `  <div class="nav-follow nav-follow-`+res[0][i].community_id+`" data-id="`+res[0][i].community_id+`">
                                        <div class="row">
                                            <div class="image-user">`
                                            if (res[0][i].image != null) {
                                                navFollow +=`<img src="../frontend/images/`+res[0][i].image+`" class="img-user-com">`
                                            }else{
                                                navFollow += `<img src="../frontend/images/user.png" class="img-user-com">`
                                            }
                                           
                                            navFollow +=`</div>
                                            <div>
                                                <p class="user-answer">`+res[0][i].name+`</p>
                                                <p class="title">`+res[0][i].title+`</p>
                                            </div>
                                        </div>
                                    </div>`
                    
                }
                $('.box-nav-follow').html(navFollow);
                
            },
            error: function(e) {
                console.log(e);
            }
        });
       
    })

    $('.nav-follow').click(function(){
        id = $(this).data("id");
       console.log(id)
        var url = '{{ route("oneQuest", ":id") }}';
        url = url.replace(':id', id);
    })
    var id;
    $(".community-comment").click(function(){
        id = $(this).data("id")
        $(".append-comment-"+id).toggle();
    });
    $('.kk').click(function(){
        
        cmtCommunity = ``;
        cmtCommunity +=``
        
        })

        $('.comment-send-1').click(function(e){
            console.log(id)
                        var new_mess = $('.cmt-input-'+id).val();
                        var parent_id = $(this).attr("data-id") ? $(this).attr("data-id") : 0;
                       var boxNewCmt= ``;
                       if(new_mess != ""){
                            $.ajax({
                                url: "{{ route('createComment') }}",
                                type: 'post',
                                data: {
                                    "new_mess": new_mess,
                                    "parent_id": parent_id,
                                    "community_id": id
                                },
                                headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                                success: function(res){
                                    console.log(res);
                                    boxNewCmt = ``;
                                    boxNewCmt += `<div style="margin-bottom: 22px;">
                                                        
                                                    <div class="row">
                                                        <div class="image-user">`
                                                        if (res.image != null) {
                                                            boxNewCmt +=`<img src="../frontend/images/`+res.image+`" class="img-user-com">`
                                                        }else{
                                                            boxNewCmt += `<img src="../frontend/images/user.png" class="img-user-com">`
                                                        }
                                                            
                                                        boxNewCmt += `</div>
                                                        <div>
                                                            <p class="user-answer">`+res.name+`</p>
                                                            <p class="topic-answer"></p>
                                                        </div>
                                                    </div>
                                                    <div class="content-comment">
                                                        <a>`+ new_mess+`</a>
                                                    </div>
                                                    <div class="comment-action-container">
                                                        <div class="btn-cmt btn-comment" >
                                                            <i class="fa fa-comment"></i>
                                                        </div>
                                                    </div>
                                                    <div class="cmt"></div>
                                                </div>`

                                            $('.append-'+id).html(boxNewCmt)

                                    boxInput=``;
                                    boxInput +=`<textarea name="comment-parent-1"  class="comment-com cmt-input-`+id+`"></textarea>`
                                    $('.comt-'+id).html(boxInput)
                                },
                                error: function(e) {
                                    console.log(e);
                                }
                            });
                        }
                  
                    }); 
        $('.btn-comment').click(function(){
            parent_id= $(this).data("id")
            
            $(".all-rep-"+ parent_id).toggle();
            console.log(parent_id)
          
            $('.comment-send-2').click(function(e){
                var new_mess = $('.cmt-input-'+parent_id).val();
                community_id = $(this).data('id')
                       var boxNewCmt= ``;
                       if(new_mess != ""){
                            $.ajax({
                                url: "{{ route('createComment') }}",
                                type: 'post',
                                data: {
                                    "new_mess": new_mess,
                                    "parent_id": parent_id,
                                    "community_id": community_id
                                },
                                headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                                success: function(res){
                                    console.log(res);
                                    boxNewCmt = ``;
                                    boxNewCmt += `<div style="    margin-bottom: 22px; margin-left: 41px;">
                                                        
                                                    <div class="row">
                                                        <div class="image-user" style="    margin-top: 25px;      margin-left: 37px;">`
                                                        if (res.image != null) {
                                                            boxNewCmt +=`<img src="../frontend/images/`+res.image+`" class="img-user-com">`
                                                        }else{
                                                            boxNewCmt += `<img src="../frontend/images/user.png" class="img-user-com">`
                                                        }
                                                            
                                                        boxNewCmt += `</div>
                                                        <div>
                                                            <p class="user-answer">`+res.name+`</p>
                                                            <p class="topic-answer"></p>
                                                        </div>
                                                    </div>
                                                    <div class="content-comment">
                                                        <a>`+ new_mess+`</a>
                                                    </div>
                                                </div>`

                                            $('.cmt-'+parent_id).html(boxNewCmt)
                                            boxInput=``;
                                    boxInput +=`<textarea name=""  class="comment-com-2 cmt-input-`+parent_id+`"></textarea>`
                                    $('.reply-'+parent_id).html(boxInput)
                                },
                                error: function(e) {
                                    console.log(e);
                                }
                            });
                        }
            });
        })
        
   })
</script>
@endsection
@section('main-content')

<div class="col-md-4">
    <div class="box-add-quest ng-scope" data-toggle="modal">
        <i class="fa fa-plus" aria-hidden="true"></i>Thêm câu hỏi
    </div>

    <div class="box-category" style="line-height: 28px;">
        <a class="box-item-cate {{ ($topic == 1)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>1]) }}">
            <img  src="../frontend/images/all.png" class="box-img-cate">Tất cả
        </a><br>
        <a class="box-item-cate {{ ($topic == 2)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>2]) }}">
            <img  src="../frontend/images/translate.png" class="box-img-cate">Dịch
        </a><br>
        <a class="box-item-cate {{ ($topic == 3)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>3]) }}">
            <img  src="../frontend/images/hiragana.png" class="box-img-cate">Học Tiếng Nhật
        </a><br>
        <a class="box-item-cate {{ ($topic == 4)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>4]) }}">
            <img  src="../frontend/images/leaning.png" class="box-img-cate">Du Học Nhật Bản
        </a><br>
        <a class="box-item-cate {{ ($topic == 5)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>5]) }}">
            <img  src="../frontend/images/job.png" class="box-img-cate">Việc làm tiếng Nhật
        </a><br>
        <a class="box-item-cate {{ ($topic == 6)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>6]) }}">
            <img  src="../frontend/images/national.png" class="box-img-cate">Văn Hoá Nhật Bản
        </a><br>
        <a class="box-item-cate {{ ($topic == 7)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>7]) }}">
            <img  src="../frontend/images/dulich.jpg" class="box-img-cate">Du lịch Nhật Bản
        </a><br>
        <a class="box-item-cate {{ ($topic == 8)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>8]) }}">
            <img  src="../frontend/images/share.png" class="box-img-cate">Góc chia sẻ
        </a><br>
        <a class="box-item-cate {{ ($topic == 10)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>10]) }}">
            <img  src="../frontend/images/cntt.jpg" class="box-img-cate">CNTT
        </a><br>
        <a class="box-item-cate {{ ($topic == 12)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>12]) }}">
            <img  src="../frontend/images/xaydung.png" class="box-img-cate">Xây dựng
        </a><br>
        <a class="box-item-cate {{ ($topic == 11)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>11]) }}">
            <img  src="../frontend/images/cokhi.jpg" class="box-img-cate">Cơ khí
        </a><br>
        <a class="box-item-cate {{ ($topic == 13)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>13]) }}">
            <img  src="../frontend/images/yte.jpg" class="box-img-cate">Y tế
        </a><br>
        <a class="box-item-cate {{ ($topic == 9)?'active-community':'' }}" href="{{ route('web.community', ['topic'=>9]) }}">
            <img  src="../frontend/images/ask.png" class="box-img-cate">Khác
        </a>
    </div>

    <span class="nav-name">Câu hỏi theo dõi</span>
    <div class="box-nav-follow">
        @if(isset($followQuest))
            @foreach($followQuest as $fo)
                <div class="nav-follow nav-follow-{{ $fo->community_id }}" data-id="{{ $fo->community_id }}">
                    <a href="{{ route('oneQuest', ['id'=> $fo->community_id ]) }}">
                    <div class="row">
                        <div class="image-user">
                            <img src="../frontend/images/{{ isset( $fo->image )? $fo->image:'user.png'}}" class="img-user-com">
                        </div>
                        <div>
                            <p class="user-answer">{{ $fo->name }}</p>
                            <p class="title">{{ $fo->title }}</p>
                        </div>
                    </div>
                    </a>
                </div>
            @endforeach
        @endif
    </div>
</div>
<div class="col-md-8 content-community">
 
    @for($i = 0; $i < sizeof($allAnswer); $i++)
    <div class="box-answer">
        <div class="title-answer">
            <a>{{ $allAnswer[$i]->title }}</a>
        </div>
        <div class="row">
            <div class="image-user">
                <img src="../frontend/images/{{ isset( $allAnswer[$i]->image )? $allAnswer[$i]->image :'user.png'}}" class="img-user-com">
            </div>
            <div>
                <p class="user-answer">{{ $allAnswer[$i]->name }}</p>
                <p class="topic-answer"></p>
            </div>
        </div>
        <div class="content-answer">
            <a>{{ $allAnswer[$i]->content }}</a>
        </div>
        <div class="row box-repAnswer">  
            {{-- @if(isset($user->id))
            <div class="box-like {{ $allAnswer[$i]->id }} {{ isset($allAnswer[$i]->status)? 'liked': 'community-like' }}" data-id="{{ $allAnswer[$i]->id }}">
            
                <i class="fa fa-thumbs-up"></i>
                
                    <span class="txt-web ">Thích </span> 
                
                <div class="ng-binding count-like-{{ $allAnswer[$i]->id }}" style="margin-left: -18px;">{{ sizeof($allAnswer[$i]->follow_quest) }}</div>
            </div>
            @endif                  --}}
            <div class="community-comment"  data-id="{{ $allAnswer[$i]->id }}">
                <i class="fa fa-comment"></i>
                <span class="txt-web">Bình luận </span>
                @foreach($countCmt as $co)
                @if($co->community_id == $allAnswer[$i]->id)
                 <span class="ng-binding"></span>
                 @else
                 @endif
                 @endforeach
            </div>
            @if(isset($user->id))
            <div class="box-follow {{ $allAnswer[$i]->id }} {{ isset($allAnswer[$i]->status)? 'followed': 'community-follow' }}" data-id="{{ $allAnswer[$i]->id }}">
           
                <i class="fa fa-rss"></i>
                
                    <span class="txt-web ">Theo dõi </span> 
                
                <div class="ng-binding count-follow-{{ $allAnswer[$i]->id }}" style="margin-left: -18px;">{{ sizeof($allAnswer[$i]->follow_quest) }}</div>
            </div>
            @endif
        </div>
        <hr class="line-vote">
       
        <div class="append-comment-{{ $allAnswer[$i]->id }}" style="display:none">
            @if(isset($user->id))
                <div class="row">
                    <div class="image-user">
                        <img src="../frontend/images/{{ isset( $user->image )? $user->image :'user.png'}}" class="img-user-com", style="    margin-top: 25px;">
                    </div>
                    <div class="content-answer comt-{{ $allAnswer[$i]->id }}">
                        <textarea name="comment-parent-1"  class="comment-com cmt-input-{{ $allAnswer[$i]->id }}"></textarea>
                    </div>
                    <div class="btn-send comment-send-1" >Gửi</div>
                </div>
            @endif
            <div class="append-{{ $allAnswer[$i]->id }}"></div>
            @for($j = 0; $j < sizeof($comment[$i]); $j++)
                <div style="margin-bottom: 22px; margin-top: 10px;">
            
                <div class="row">
                    <div class="image-user">
                        <img src="../frontend/images/{{ isset( $comment[$i][$j]->image )? $comment[$i][$j]->image:'user.png'}}" class="img-user-com">
                    </div>
                    <div>
                        <p class="user-answer">{{ $comment[$i][$j]->name }}</p>
                        <p class="topic-answer"></p>
                    </div>
                </div>
                <div class="content-comment">
                    <a>{{ $comment[$i][$j]->content }}</a>
                </div>
                <div class="comment-action-container" data-id="{{ $comment[$i][$j]->id }}">
                    <div class="btn-cmt btn-comment" data-id="{{ $comment[$i][$j]->id }}">
                        <i class="fa fa-comment"></i>
                    </div>
                </div>
                <div class="all-rep-{{ $comment[$i][$j]->id }} all-rep">
                    @if(isset($user->id))
                    <div class="row">
                        <div class="image-user">
                            <img src="../frontend/images/{{ isset( $user->image )? $user->image :'user.png'}}" class="img-user-com" style="    margin-top: 25px;      margin-left: 37px;">
                        </div>
                        <div class="content-answer cmt-content reply-{{ $comment[$i][$j]->id }}">
                            <textarea name=""  class="comment-com-2 cmt-input-{{ $comment[$i][$j]->id }}"></textarea>
                        </div>
                        <div class="btn-send comment-send-2 " data-id="{{ $allAnswer[$i]->id }}">Gửi</div>
                    </div>
                    <div class="cmt-{{ $comment[$i][$j]->id }}"></div>
                    @endif
                    @foreach($repComment as $rep)
                        @if($comment[$i][$j]->id  == $rep->parent_id)
                        <div class="row">
                            <div class="image-user">
                                <img src="../frontend/images/{{ isset( $comment[$i][$j]->image )? $comment[$i][$j]->image:'user.png'}}" class="user-rep">
                            </div>
                            <div class="user-answer-rep">
                                <p class="user-answer">{{ $comment[$i][$j]->name }}</p>
                                <p class="topic-answer"></p>
                            </div>
                        </div>
                        <div class=" content-rep">{{ $rep->content }}</div>
                      
                        @endif
                    @endforeach
                </div>
                
            
            </div>
            
            @endfor
        </div>
       
    </div>
    @endfor
    <div class="pagination">
    {{ $allAnswer->appends(['topic' => $topic])->links() }}
    </div>
</div>


@include('frontend.modal.answer')
@endsection