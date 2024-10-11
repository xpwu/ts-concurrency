
export class node<E> {
	isValid: boolean = true
	element:E
	next: node<E>|null = null

	constructor(e: E) {
		this.element = e
	}

	inValid() {
		this.isValid = false
	}
}

export class queue<E> {
	first: node<E>|null = null
	last: node<E>|null = null
	count: number = 0

	en(e: E): node<E> {
		let newNode = new node(e)

		if (this.last == null) {
			this.last = newNode
			this.first = this.last
			this.count += 1
			return newNode
		}

		this.last.next = newNode
		this.last = this.last.next
		this.count += 1
		return newNode
	}

	de(): E|null {
		while (this.first != null && !this.first.isValid) {
			this.first = this.first.next
			this.count -= 1
		}

		if (this.first == null) {
			return null
		}

		let ret = this.first.element
		this.first = this.first.next

		if (this.first == null) {
			this.last = null
		}

		this.count -= 1

		return ret
	}
}

