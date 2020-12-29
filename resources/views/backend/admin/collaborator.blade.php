@extends('backend.layouts.master')

@section('title', 'Admin-Users')

@section('breadcrumbs')
<section class="content-header">
    <h1>
        Trang chủ
        <small>Thành viên admin</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Trang chủ</a></li>
        <li class="active">Cộng tác viên</li>
    </ol>
</section>
@endsection

@section('after-script-end')
    <script>
        $(function(){
            var today = new Date();
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            if (yyyy == 2020) {
                $('.2020').css('display','block')
            }
            if (yyyy == 2021) {
                $('.2020').css('display','block')
                $('.2021').css('display','block')
            }
            if (yyyy == 2022) {
                $('.2020').css('display','block')
                $('.2021').css('display','block')
                $('.2022').css('display','block')
            }
            $('.select-month').val(mm);
            $('.select-year').val(yyyy);
            start = yyyy + '/' + mm + '/' + 01;
            end = yyyy + '/' + mm + '/' + 31;
            // delete user
            function getCollabo(start, end){
                console.log(start)
                $.ajax({
                    url: '{{ route("admin.ajax.collabo") }}',
                    type: 'post',
                    data: {
                        start: start,
                        end: end
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')},
                    success: function(res){
                        console.log(res.data)
                        var boxPeriod = ''
                       
                        for (i = 0; i < res.data.length; i++) {
                            if ((res.data[i].news).length >0) {
                                boxPeriod += "<tr>"
                                boxPeriod += "<td>"+i+"</td>"
                                boxPeriod += "<td>"+res.data[i].name+"</td>"
                                boxPeriod += "<td>"+res.data[i].email+"</td>"
                                boxPeriod += "<td>"+(res.data[i].news).length+"</td>"
                                boxPeriod += "</tr>"
                            }
                           
                        }
                        $('tbody').html(boxPeriod);
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            }
            getCollabo(start, end);
            $('.select-year').change(function(){
                yyyy = $(this).val();

                start = yyyy + '/' + mm + '/' + 01;
                end = yyyy + '/' + mm + '/' + 31;
                var current = $(this);
                getCollabo(start, end);
              
            })
            $('.select-month').change(function(){
                var mm = $(this).val();
                start = yyyy + '/' + mm + '/' + 01;
                end = yyyy + '/' + mm + '/' + 31;
                var current = $(this);
                getCollabo(start, end);
              
            })
        })
    </script>
@endsection

@section('main-content')
<div class="box box-info">
    <div class="box-header with-border">
        <h3 class="box-title">Danh sách.</h3>
        <div class="box-tools">
            <form method="GET" action="">
                <select class="select-year">
                    <option value="2022" style="display: none" class="2022">2022</option>
                    <option value="2021" style="display: none" class="2021">2021</option>
                    <option value="2020" style="display: none" class="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                </select>
                <select class="select-month">
                    <option value="01">Tháng 1</option>
                    <option value="02">Tháng 2</option>
                    <option value="03">Tháng 3</option>
                    <option value="04">Tháng 4</option>
                    <option value="05">Tháng 5</option>
                    <option value="06">Tháng 6</option>
                    <option value="07">Tháng 7</option>
                    <option value="08">Tháng 8</option>
                    <option value="09">Tháng 9</option>
                    <option value="10">Tháng 10</option>
                    <option value="11">Tháng 11</option>
                    <option value="12">Tháng 12</option>
                </select>
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
                            <th>Số bài báo</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                    </tbody>
                </table>
            </div>
        </div>
        <!--Phân trang-->
        <div class="clearfix"></div>
    </div>
</div>
@endsection