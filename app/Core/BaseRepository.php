<?php namespace app\Core;
use App\Models\News;
abstract class BaseRepository{
	/**
	 * Get all items of model
	 * @return Illuminate\Support\Collection Model collections
	 */
	public function getAll()
	{
		return $this->model->all();
	}

	/**
	* Get all items vs condition
	*/
	public function getAllWithCondition($condition=[]){
		$data_width_condition = $this->model;
		//Nếu lấy bản ghi có điều kiện
		if (!empty($condition)){

			foreach ($condition as $key => $value) {
				if ($value == ''){
					unset($condition[$key]);
				}
				//Trường hợp nếu param truyền vào dạng ['column' => ['operator'=>'>','value'=> 1]]
				if(is_array($value)){
					$op     = array_get($value, 'operator');
            	$val    = array_get($value, 'value');
            	$column = $key;
            	$data_width_condition = $data_width_condition->where($column, $op, $val); 
				} else {

					//Trường hợp truyền vào simple ['column'=>'value']
					$data_width_condition = $data_width_condition->where($key,$value);
				}
			}

			return $data_width_condition->get();
		}
	}


	/**
	 * Get item of model. If model not exist then it will throw an exception
	 * Nếu không tồn tại ID thông báo not foud
	 * @param  int $id Model ID
	 * @return Model
	 */
	public function getById($id,$condition=[])
	{
		$data_by_id = $this->model;
		
		//Nếu lấy bản ghi có điều kiện
		if (!empty($condition)){

			foreach ($condition as $key => $value) {
				if ($value == ''){
					unset($condition[$key]);
				}
				//Trường hợp nếu param truyền vào dạng ['column' => ['operator'=>'>','value'=> 1]]
				if(is_array($value)){
					$op     = array_get($value, 'operator');
            	$val    = array_get($value, 'value');
            	$column = $key;
            	$data_by_id = $data_by_id->where($column, $op, $val); 
				} else {

					//Trường hợp truyền vào simple ['column'=>'value']
					$data_by_id = $data_by_id->where($key,$value);
				}
			}

			return $data_by_id->findOrFail($id);
		} else {
			return $data_by_id->findOrFail($id);
		}
	}

	/**
	 * Get items with filter & paginate
	 * @param  array  $filter
	 * @param  integer $pageSize
	 * @return Illuminate\Support\Collection Model collections
	 */
	public function getAllWithPaginate($param){
		$allNews = News::where('status', $param)
		->paginate(20);
		return $allNews;
	}
	public function getNewsWithUser($id){
		$news = News::where('user_id', $id)
		->paginate(12);
		return $news;
	}
	/**
	 * Create a new model
	 * @param  array $attributes
	 * @return Bool
	 */
	public function create($attributes)
	{
		return $this->model->create($attributes);
	}

	/**
	 * Update an exitst model
	 * @param  array $attributes
	 * @param  array $condition
	 * @return Bool
	 */
	public function update($attributes, $condition = [])
	{
		$obj = $this->model;
		if ( ! empty($condition))
		{
			foreach($condition as $key => $value){
				$obj = $obj->where($key, $value);
			}
			return $obj->update($attributes);
		}
		return $obj->update($attributes);
	}
}
?>