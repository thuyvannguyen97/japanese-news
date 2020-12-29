<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCommentCommunityTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('comment_community', function(Blueprint $table)
		{
			$table->integer('id', true);
			$table->integer('community_id');
			$table->integer('user_id');
			$table->integer('parent_id');
			$table->string('content', 200);
			$table->boolean('active');
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('comment_community');
	}

}
