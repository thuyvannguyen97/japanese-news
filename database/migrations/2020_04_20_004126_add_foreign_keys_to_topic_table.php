<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToTopicTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('topic', function(Blueprint $table)
		{
			$table->foreign('id', 'topic_ibfk_1')->references('id')->on('community')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('topic', function(Blueprint $table)
		{
			$table->dropForeign('topic_ibfk_1');
		});
	}

}
