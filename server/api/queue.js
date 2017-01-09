// Queue implementation

function Node (data, next){
	this.data = data;
	this.next = next;
}

function Queue (){
	this.first = new Node(0);
	this.last = this.first;

	//Enqueue an element at the end of the queue
	//Constant time
	this.enqueue = function (data){
		this.last.next = new Node(data, null);
		console.log(this.last);
		this.last = this.last.next;
		console.log(this.last);
		this.first.data++;
	};

	//Dequeue an element, remove the first element and return it
	//Constant time
	this.dequeue = function (){
		tmpNode = this.first.next.data;
		this.first.next = this.first.next.next;
		this.first.data--;
		return tmpNode;
	};

	//Peek the first element, return the first element without removing it
	//Constant time
	this.peek = function (){
		return this.first.next.data;
	};

	//Get the size of the queue
	this.getSize = function (){
		return this.first.data;
	};

	//Get the queue as an array
	//Linear time
	this.getArray = function (){
		return getQueue(this);
	}
}

module.exports = Queue;

function getQueue (q){
	retArray = [];
	iterator = q.first.next;
	for(var i = 0; i < q.getSize(); i++){
		console.log(iterator);
		retArray.push(iterator.data);
		iterator = iterator.next;
	}
	return retArray;
}

