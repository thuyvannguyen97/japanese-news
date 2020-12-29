<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Code;
use Response;

class CodeController extends Controller
{
    //
    private $code;

    public function __construct() {
        $this->code = new Code();
    }

    public function getCode() {
        $now  = date('Y-m-d H:i:s');
        
        $code = $this->code->where('status', 0)->whereDate('expiry_date', '>', $now)->first();
        if($code) {
            // udpate status code
            $code->status = 1;
            $code->save();
            return Response::json([
                'status'  => 200,
                'message' => 'Success',
                'result'  => $code->code 
            ], 200);
        }
        else {
            return Response::json([
                'status' => 404,
                'message' => 'Not found'
            ], 200);
        }
    }

    public function active(Request $request) {
        $uid  = $request->uid;
        $code = $request->code;

        if(empty($uid)) {
            return Response::json([
                'status' => 402,
                'message' => 'Truyền lên thiết bị.'
            ], 200);
        }
        // Trường hợp active lại
        $active = $this->code->where([
            'code' => $code,
            'status' => 2,
            'uid'    => $uid
        ])->first();
        if($active) {
            return Response::json([
                'status' => 200,
                'message' => 'Success',
                'result' => $active->expiry_date
            ], 200);
        }
        // Trường hợp mới active
        $check = $this->code->where([
            'code' => $code,
            'status' => 1,
            'uid' => null
        ])->first();
        if($check) {
            $today = strtotime(date('Y-m-d H:i:s'));
            $expried = strtotime($check->expiry_date);
            if($expried <= $today) {
                return Response::json([
                    'status' => 401,
                    'message' => 'Mã code hết hạn.'
                ], 200);
            }
            else {
                // update code
                $check->uid = $uid;
                $check->status   = 2;
                if($check->save()) {
                    return Response::json([
                        'status' => 200,
                        'message' => 'Success',
                        'result' => $check->expiry_date
                    ], 200);
                }
                else {
                    return Response::json([
                        'status' => 500,
                        'message' => 'Lỗi không thể cập nhật.'
                    ], 200);
                }
            }
        }
        else {
            return Response::json([
                'status' => 404,
                'message' => 'Mã code không tồn tại.'
            ], 200);
        }
    }
}
