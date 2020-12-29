<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTopicTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('topic', function(Blueprint $table)
		{
			$table->integer('id', true);
			$table->string('name', 50);
			$table->string('image', 50);
			$table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('topic');
	}

}
