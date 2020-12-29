<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Version;
use Response;

class VersionController extends Controller
{
    //
    private $version;

    public function __construct()
    {
        $this->version = new Version();
    }

    public function getCurrent(Request $request) {
        $name = $request->name;
        $version = $this->version->where('name', $name)->first();
        if($version) {
            return Response::json([
                'status' => 200,
                'message' => 'Success',
                'results' => $version
            ], 200);
        } else {
            return Response::json([
                'status' => 404,
                'message' => 'Name sai'
            ], 200);
        }
    }
}
