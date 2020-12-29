<div class="modal addAnswer" id="addAnswer" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document" style="    margin-top: 3px; margin-left: 27px;
    margin-right: 17px;">
    <div class="modal-content">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="margin-right: -390px;">
        <span aria-hidden="true">&times;</span>
    </button>
      <form action="{{  route('addAnswer') }}" method="post">
            <input type="hidden" name="_token" value="{{ csrf_token() }}"> 
                <div class="list-cate row">
                    <div>
                        <p class="tt-cate">Câu hỏi của bạn thuộc chủ đề :</p>
                    </div>
                    <div class="box-select-cate">
                        <select options="item as item.name for item in data track by item.id"  class="" name="topic">
                            <option value="2" label="Dịch">Dịch</option>
                            <option value="3" label="Học Tiếng Nhật">Học Tiếng Nhật</option>
                            <option value="4" label="Du Học Nhật Bản">Du Học Nhật Bản</option>
                            <option value="5" label="Việc Làm Tiếng Nhật">Việc Làm Tiếng Nhật</option>
                            <option value="6" label="Văn Hoá Nhật Bản">Văn Hoá Nhật Bản</option>
                            <option value="7" label="Du Lịch Nhật Bản">Du Lịch Nhật Bản</option>
                            <option value="8" label="Góc Chia Sẻ">Góc Chia Sẻ</option>
                            <option value="10" label="CNTT">CNTT</option>
                            <option value="11" label="Cơ Khí">Cơ Khí</option>
                            <option value="12" label="Xây dựng" selected="selected">Xây dựng</option>
                            <option value="13" label="Y Tế">Y Tế</option>
                            <option value="9" label="Khác">Khác</option>
                        </select>
                    </div>
                   
                </div>
                <div class="box-title">
                    <input type="text" placeholder="Nhập tiêu đề câu hỏi của bạn" name="title" class="input-title-answer" required>
                </div>
                <div class="box-input">
                    <textarea name="content" cols="40" rows="5" style="width: 100%;" aria-valuetext="" required></textarea><br>
                </div>
                
             
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" style="margin-top: 11px; height: 36px;">Close</button>
                    <button class="btn-post">Đăng tin</button>
                </div>
            </form>
     
     
    </div>
  </div>
</div>
