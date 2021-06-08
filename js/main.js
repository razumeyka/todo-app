document.addEventListener('DOMContentLoaded', () => {
	
	const mainWrap = document.querySelector('body'),
		  themeBtn = document.querySelector(".theme-btn"),
		  newItemInput = document.querySelector(".new-item"),
		  todoList = document.querySelector(".todo-list ul"),
		  todoItem = document.querySelectorAll(".todo-list__item"),
		  todoNoItems = document.querySelector(".todo-list__no-items"),
		  clearComplitedBtn = document.querySelector(".todo-list__clear"),
		  showAllBtn = document.querySelector(".todo-list__all-btn"),
		  showComplitedBtn = document.querySelector(".todo-list__complited-btn"),
		  showActiveBtn = document.querySelector(".todo-list__active-btn"),
		  leftItems = document.querySelector(".todo-list__left-items span");
	
	let currentTasks = [];
	
	if ( localStorage.getItem('todo') ) {
		currentTasks = JSON.parse(localStorage.getItem('todo'));
	}
	
	if ( localStorage.getItem('theme') === 'dark' ) {
		mainWrap.classList.remove('dark-theme');
		mainWrap.classList.add('light-theme');
	} else {
		mainWrap.classList.remove('light-theme');
		mainWrap.classList.add('dark-theme');
	}

	function showTasks() {
		let newTask = "";
		let taksQty = currentTasks.length;
		
		leftItems.innerHTML = taksQty;
		
		if (taksQty === 0) {
			todoList.innerHTML = '';
			todoNoItems.classList.add('show');
			todoNoItems.innerHTML = "You do not have any tasks";
		} else {
			todoNoItems.classList.remove('show');
		}
		
		currentTasks.forEach(function(item, i) {
			newTask += `
				<li class="todo-list__item" draggable="true">
					<label class="checkbox">
						<input type="checkbox" id="todo-list__task${i}" ${item.taskState ? "checked" : ""} value="">
						<span class="checkbox__field">${item.taskContent}</span>
					</label>
					<div class="todo-list__remove-btn"></div>
				</li>
			`;
			todoList.innerHTML = newTask;
		});
		
		DragAndDrop();
	};
	showTasks();
	
	function showActiveTasks() {
		let newTask = "";
		let activeTasks = [];
		currentTasks.forEach(function(item, i){
			if (currentTasks.length === 0) {
				todoList.innerHTML = '';
				todoNoItems.classList.add('show');
				todoNoItems.innerHTML = "You do not have any tasks";
			} else {
				todoNoItems.classList.remove('show');
			}
			if ( item.taskState !== true ) {
				newTask += `
					<li class="todo-list__item" draggable="true">
						<label class="checkbox">
							<input type="checkbox" id="todo-list__task${i}" ${item.taskState ? "checked" : ""} value="">
							<span class="checkbox__field">${item.taskContent}</span>
						</label>
						<div class="todo-list__remove-btn"></div>
					</li>
				`;
				todoList.innerHTML = newTask;
				activeTasks.push(item);
			}
			if (activeTasks.length === 0) {
				todoNoItems.classList.add('show');
				todoNoItems.innerHTML = "You do not have active tasks";
				todoList.innerHTML = '';
			}
		});
	}
	
	function showComplitedTasks() {

		let newTask = "";
		let complitedTasks = [];

		currentTasks.forEach(function(item, i){
			if (currentTasks.length === 0) {
				todoList.innerHTML = '';
				todoNoItems.classList.add('show');
				todoNoItems.innerHTML = "You do not have any tasks";
			} else {
				todoNoItems.classList.remove('show');
			}

			if ( item.taskState === true ) {
				newTask += `
					<li class="todo-list__item" draggable="true">
						<label class="checkbox">
							<input type="checkbox" id="todo-list__task${i}" ${item.taskState ? "checked" : ""} value="">
							<span class="checkbox__field">${item.taskContent}</span>
						</label>
						<div class="todo-list__remove-btn"></div>
					</li>
				`;
				todoList.innerHTML = newTask;
				complitedTasks.push(item);
			}

			if (complitedTasks.length === 0) {
				todoNoItems.classList.add('show');
				todoNoItems.innerHTML = "You do not have complited tasks";
				todoList.innerHTML = '';
			}
		});
	}
	
	newItemInput.addEventListener('keydown', function(e) {
		if (e.keyCode === 13) {
			if (!this.value ) return;
			
			let newTaskVal = this.value,
				newTaskState = this.parentNode.querySelector('input[type="checkbox"]').checked;
			
			let newTaskObj = {
				taskContent: newTaskVal,
				taskState: newTaskState
			};
			
			if (newTaskState) {
				currentTasks.push(newTaskObj);
			} else {
				currentTasks.unshift(newTaskObj);
			}
			
			showTasks();
			localStorage.setItem('todo', JSON.stringify(currentTasks));
			
			this.value = '';
		}
	});
	
	todoList.addEventListener('change', () => {
		let elContent = event.target.nextElementSibling.innerHTML;
		
		currentTasks.forEach(function(item){
			if ( item.taskContent === elContent) {
				item.taskState = !item.taskState;
			}
		});
		
		localStorage.setItem('todo', JSON.stringify(currentTasks));
	});
	
	todoList.addEventListener('click', () => {
		let removeBtn = document.querySelectorAll(".todo-list__remove-btn");
		let el = event.target;
		
		removeBtn.forEach( function(item,i){
			if ( el === item) {
				currentTasks.splice(i, 1);
				localStorage.setItem('todo', JSON.stringify(currentTasks));
				if ( showAllBtn.classList.contains("active")) {
					showTasks();
				} else if (showComplitedBtn.classList.contains("active")) {
					showComplitedTasks();
				} else if (showActiveBtn.classList.contains("active")) {
					showActiveTasks();
				}
			}
		});
	});
	
	clearComplitedBtn.addEventListener('click', () => {
		currentTasks = currentTasks.filter(function(item) {
			return item.taskState !== true;
		});
		
		localStorage.setItem('todo', JSON.stringify(currentTasks));
		showTasks();
		
		if (showComplitedBtn.classList.contains("active")) {
			todoNoItems.classList.add('show');
			todoNoItems.innerHTML = "You do not have complited tasks";
			todoList.innerHTML = '';
		}
	});
	
	showAllBtn.addEventListener('click', () => {
		showComplitedBtn.classList.remove("active");
		showActiveBtn.classList.remove("active");
		event.target.classList.add("active");
		
		showTasks();
	});
	
	showComplitedBtn.addEventListener('click', (
	) => {
		showAllBtn.classList.remove("active");
		showActiveBtn.classList.remove("active");
		event.target.classList.add("active");
		
		showComplitedTasks();
	});
	
	showActiveBtn.addEventListener('click', () => {
		showAllBtn.classList.remove("active");
		showComplitedBtn.classList.remove("active");
		event.target.classList.add("active");
		
		showActiveTasks();
	});
	
	
/* drag and drop */
	
	function DragAndDrop() {
		todoList.addEventListener('dragstart', (event) => {
			event.target.classList.add('selected');
		})

		todoList.addEventListener('dragend', (event) => {
			event.target.classList.remove('selected');
		});
		
		todoList.addEventListener('dragover', (evt) => {
			evt.preventDefault();
			const activeElement = todoList.querySelector('.selected');
			const currentElement = evt.target;
			const isMoveable = activeElement !== currentElement && currentElement.classList.contains('todo-list__item');

			if (!isMoveable) {
				return;
			}

			const nextElement = (currentElement === activeElement.nextElementSibling) ?
				currentElement.nextElementSibling :
				currentElement;

			todoList.insertBefore(activeElement, nextElement);
		});
	}

	
/* theme changing */
	
	themeBtn.addEventListener('click', () => {
		if (mainWrap.classList.contains("dark-theme")) {
			mainWrap.classList.remove('dark-theme');
			mainWrap.classList.add('light-theme');
			localStorage.setItem('theme', 'dark');
		} else {
			mainWrap.classList.remove('light-theme');
			mainWrap.classList.add('dark-theme');
			localStorage.setItem('theme', 'light');
		}
	});
	
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcblx0XHJcblx0Y29uc3QgbWFpbldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksXHJcblx0XHQgIHRoZW1lQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50aGVtZS1idG5cIiksXHJcblx0XHQgIG5ld0l0ZW1JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmV3LWl0ZW1cIiksXHJcblx0XHQgIHRvZG9MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RvLWxpc3QgdWxcIiksXHJcblx0XHQgIHRvZG9JdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50b2RvLWxpc3RfX2l0ZW1cIiksXHJcblx0XHQgIHRvZG9Ob0l0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RvLWxpc3RfX25vLWl0ZW1zXCIpLFxyXG5cdFx0ICBjbGVhckNvbXBsaXRlZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kby1saXN0X19jbGVhclwiKSxcclxuXHRcdCAgc2hvd0FsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kby1saXN0X19hbGwtYnRuXCIpLFxyXG5cdFx0ICBzaG93Q29tcGxpdGVkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RvLWxpc3RfX2NvbXBsaXRlZC1idG5cIiksXHJcblx0XHQgIHNob3dBY3RpdmVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZG8tbGlzdF9fYWN0aXZlLWJ0blwiKSxcclxuXHRcdCAgbGVmdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RvLWxpc3RfX2xlZnQtaXRlbXMgc3BhblwiKTtcclxuXHRcclxuXHRsZXQgY3VycmVudFRhc2tzID0gW107XHJcblx0XHJcblx0aWYgKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9kbycpICkge1xyXG5cdFx0Y3VycmVudFRhc2tzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9kbycpKTtcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gc2hvd1Rhc2tzKCkge1xyXG5cdFx0bGV0IG5ld1Rhc2sgPSBcIlwiO1xyXG5cdFx0bGV0IHRha3NRdHkgPSBjdXJyZW50VGFza3MubGVuZ3RoO1xyXG5cdFx0XHJcblx0XHRsZWZ0SXRlbXMuaW5uZXJIVE1MID0gdGFrc1F0eTtcclxuXHRcdFxyXG5cdFx0aWYgKHRha3NRdHkgPT09IDApIHtcclxuXHRcdFx0dG9kb0xpc3QuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdHRvZG9Ob0l0ZW1zLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuXHRcdFx0dG9kb05vSXRlbXMuaW5uZXJIVE1MID0gXCJZb3UgZG8gbm90IGhhdmUgYW55IHRhc2tzXCI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0b2RvTm9JdGVtcy5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGN1cnJlbnRUYXNrcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcclxuXHRcdFx0bmV3VGFzayArPSBgXHJcblx0XHRcdFx0PGxpIGNsYXNzPVwidG9kby1saXN0X19pdGVtXCIgZHJhZ2dhYmxlPVwidHJ1ZVwiPlxyXG5cdFx0XHRcdFx0PGxhYmVsIGNsYXNzPVwiY2hlY2tib3hcIj5cclxuXHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidG9kby1saXN0X190YXNrJHtpfVwiICR7aXRlbS50YXNrU3RhdGUgPyBcImNoZWNrZWRcIiA6IFwiXCJ9IHZhbHVlPVwiXCI+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2hlY2tib3hfX2ZpZWxkXCI+JHtpdGVtLnRhc2tDb250ZW50fTwvc3Bhbj5cclxuXHRcdFx0XHRcdDwvbGFiZWw+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidG9kby1saXN0X19yZW1vdmUtYnRuXCI+PC9kaXY+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0YDtcclxuXHRcdFx0dG9kb0xpc3QuaW5uZXJIVE1MID0gbmV3VGFzaztcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHREcmFnQW5kRHJvcCgpO1xyXG5cdH07XHJcblx0c2hvd1Rhc2tzKCk7XHJcblx0XHJcblx0ZnVuY3Rpb24gc2hvd0FjdGl2ZVRhc2tzKCkge1xyXG5cdFx0bGV0IG5ld1Rhc2sgPSBcIlwiO1xyXG5cdFx0bGV0IGFjdGl2ZVRhc2tzID0gW107XHJcblx0XHRjdXJyZW50VGFza3MuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKXtcclxuXHRcdFx0aWYgKGN1cnJlbnRUYXNrcy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHR0b2RvTGlzdC5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0XHR0b2RvTm9JdGVtcy5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblx0XHRcdFx0dG9kb05vSXRlbXMuaW5uZXJIVE1MID0gXCJZb3UgZG8gbm90IGhhdmUgYW55IHRhc2tzXCI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dG9kb05vSXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggaXRlbS50YXNrU3RhdGUgIT09IHRydWUgKSB7XHJcblx0XHRcdFx0bmV3VGFzayArPSBgXHJcblx0XHRcdFx0XHQ8bGkgY2xhc3M9XCJ0b2RvLWxpc3RfX2l0ZW1cIiBkcmFnZ2FibGU9XCJ0cnVlXCI+XHJcblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzcz1cImNoZWNrYm94XCI+XHJcblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidG9kby1saXN0X190YXNrJHtpfVwiICR7aXRlbS50YXNrU3RhdGUgPyBcImNoZWNrZWRcIiA6IFwiXCJ9IHZhbHVlPVwiXCI+XHJcblx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjaGVja2JveF9fZmllbGRcIj4ke2l0ZW0udGFza0NvbnRlbnR9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidG9kby1saXN0X19yZW1vdmUtYnRuXCI+PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdGA7XHJcblx0XHRcdFx0dG9kb0xpc3QuaW5uZXJIVE1MID0gbmV3VGFzaztcclxuXHRcdFx0XHRhY3RpdmVUYXNrcy5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChhY3RpdmVUYXNrcy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHR0b2RvTm9JdGVtcy5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblx0XHRcdFx0dG9kb05vSXRlbXMuaW5uZXJIVE1MID0gXCJZb3UgZG8gbm90IGhhdmUgYWN0aXZlIHRhc2tzXCI7XHJcblx0XHRcdFx0dG9kb0xpc3QuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBzaG93Q29tcGxpdGVkVGFza3MoKSB7XHJcblxyXG5cdFx0bGV0IG5ld1Rhc2sgPSBcIlwiO1xyXG5cdFx0bGV0IGNvbXBsaXRlZFRhc2tzID0gW107XHJcblxyXG5cdFx0Y3VycmVudFRhc2tzLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSl7XHJcblx0XHRcdGlmIChjdXJyZW50VGFza3MubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0dG9kb0xpc3QuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdFx0dG9kb05vSXRlbXMuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cdFx0XHRcdHRvZG9Ob0l0ZW1zLmlubmVySFRNTCA9IFwiWW91IGRvIG5vdCBoYXZlIGFueSB0YXNrc1wiO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRvZG9Ob0l0ZW1zLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBpdGVtLnRhc2tTdGF0ZSA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRuZXdUYXNrICs9IGBcclxuXHRcdFx0XHRcdDxsaSBjbGFzcz1cInRvZG8tbGlzdF9faXRlbVwiIGRyYWdnYWJsZT1cInRydWVcIj5cclxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzPVwiY2hlY2tib3hcIj5cclxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJ0b2RvLWxpc3RfX3Rhc2ske2l9XCIgJHtpdGVtLnRhc2tTdGF0ZSA/IFwiY2hlY2tlZFwiIDogXCJcIn0gdmFsdWU9XCJcIj5cclxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImNoZWNrYm94X19maWVsZFwiPiR7aXRlbS50YXNrQ29udGVudH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdDwvbGFiZWw+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJ0b2RvLWxpc3RfX3JlbW92ZS1idG5cIj48L2Rpdj5cclxuXHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0YDtcclxuXHRcdFx0XHR0b2RvTGlzdC5pbm5lckhUTUwgPSBuZXdUYXNrO1xyXG5cdFx0XHRcdGNvbXBsaXRlZFRhc2tzLnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjb21wbGl0ZWRUYXNrcy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHR0b2RvTm9JdGVtcy5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblx0XHRcdFx0dG9kb05vSXRlbXMuaW5uZXJIVE1MID0gXCJZb3UgZG8gbm90IGhhdmUgY29tcGxpdGVkIHRhc2tzXCI7XHJcblx0XHRcdFx0dG9kb0xpc3QuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRuZXdJdGVtSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmIChlLmtleUNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGlmICghdGhpcy52YWx1ZSApIHJldHVybjtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBuZXdUYXNrVmFsID0gdGhpcy52YWx1ZSxcclxuXHRcdFx0XHRuZXdUYXNrU3RhdGUgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuY2hlY2tlZDtcclxuXHRcdFx0XHJcblx0XHRcdGxldCBuZXdUYXNrT2JqID0ge1xyXG5cdFx0XHRcdHRhc2tDb250ZW50OiBuZXdUYXNrVmFsLFxyXG5cdFx0XHRcdHRhc2tTdGF0ZTogbmV3VGFza1N0YXRlXHJcblx0XHRcdH07XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobmV3VGFza1N0YXRlKSB7XHJcblx0XHRcdFx0Y3VycmVudFRhc2tzLnB1c2gobmV3VGFza09iaik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3VycmVudFRhc2tzLnVuc2hpZnQobmV3VGFza09iaik7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHNob3dUYXNrcygpO1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9kbycsIEpTT04uc3RyaW5naWZ5KGN1cnJlbnRUYXNrcykpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy52YWx1ZSA9ICcnO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdHRvZG9MaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcclxuXHRcdGxldCBlbENvbnRlbnQgPSBldmVudC50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTDtcclxuXHRcdFxyXG5cdFx0Y3VycmVudFRhc2tzLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcblx0XHRcdGlmICggaXRlbS50YXNrQ29udGVudCA9PT0gZWxDb250ZW50KSB7XHJcblx0XHRcdFx0aXRlbS50YXNrU3RhdGUgPSAhaXRlbS50YXNrU3RhdGU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9kbycsIEpTT04uc3RyaW5naWZ5KGN1cnJlbnRUYXNrcykpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRvZG9MaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0bGV0IHJlbW92ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudG9kby1saXN0X19yZW1vdmUtYnRuXCIpO1xyXG5cdFx0bGV0IGVsID0gZXZlbnQudGFyZ2V0O1xyXG5cdFx0XHJcblx0XHRyZW1vdmVCdG4uZm9yRWFjaCggZnVuY3Rpb24oaXRlbSxpKXtcclxuXHRcdFx0aWYgKCBlbCA9PT0gaXRlbSkge1xyXG5cdFx0XHRcdGN1cnJlbnRUYXNrcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvZG8nLCBKU09OLnN0cmluZ2lmeShjdXJyZW50VGFza3MpKTtcclxuXHRcdFx0XHRpZiAoIHNob3dBbGxCdG4uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdFx0XHRzaG93VGFza3MoKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHNob3dDb21wbGl0ZWRCdG4uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdFx0XHRzaG93Q29tcGxpdGVkVGFza3MoKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHNob3dBY3RpdmVCdG4uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdFx0XHRzaG93QWN0aXZlVGFza3MoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdFxyXG5cdGNsZWFyQ29tcGxpdGVkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0Y3VycmVudFRhc2tzID0gY3VycmVudFRhc2tzLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdHJldHVybiBpdGVtLnRhc2tTdGF0ZSAhPT0gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9kbycsIEpTT04uc3RyaW5naWZ5KGN1cnJlbnRUYXNrcykpO1xyXG5cdFx0c2hvd1Rhc2tzKCk7XHJcblx0XHRcclxuXHRcdGlmIChzaG93Q29tcGxpdGVkQnRuLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSkge1xyXG5cdFx0XHR0b2RvTm9JdGVtcy5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblx0XHRcdHRvZG9Ob0l0ZW1zLmlubmVySFRNTCA9IFwiWW91IGRvIG5vdCBoYXZlIGNvbXBsaXRlZCB0YXNrc1wiO1xyXG5cdFx0XHR0b2RvTGlzdC5pbm5lckhUTUwgPSAnJztcclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHRzaG93QWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0c2hvd0NvbXBsaXRlZEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG5cdFx0c2hvd0FjdGl2ZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG5cdFx0ZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblx0XHRcclxuXHRcdHNob3dUYXNrcygpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdHNob3dDb21wbGl0ZWRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoXHJcblx0KSA9PiB7XHJcblx0XHRzaG93QWxsQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcblx0XHRzaG93QWN0aXZlQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcblx0XHRldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuXHRcdFxyXG5cdFx0c2hvd0NvbXBsaXRlZFRhc2tzKCk7XHJcblx0fSk7XHJcblx0XHJcblx0c2hvd0FjdGl2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdHNob3dBbGxCdG4uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuXHRcdHNob3dDb21wbGl0ZWRCdG4uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuXHRcdGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHJcblx0XHRzaG93QWN0aXZlVGFza3MoKTtcclxuXHR9KTtcclxuXHRcclxuXHRcclxuLyogZHJhZyBhbmQgZHJvcCAqL1xyXG5cdFxyXG5cdGZ1bmN0aW9uIERyYWdBbmREcm9wKCkge1xyXG5cdFx0dG9kb0xpc3QuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG5cdFx0fSlcclxuXHJcblx0XHR0b2RvTGlzdC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgKGV2ZW50KSA9PiB7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHRvZG9MaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGV2dCkgPT4ge1xyXG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0Y29uc3QgYWN0aXZlRWxlbWVudCA9IHRvZG9MaXN0LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpO1xyXG5cdFx0XHRjb25zdCBjdXJyZW50RWxlbWVudCA9IGV2dC50YXJnZXQ7XHJcblx0XHRcdGNvbnN0IGlzTW92ZWFibGUgPSBhY3RpdmVFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCAmJiBjdXJyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvZG8tbGlzdF9faXRlbScpO1xyXG5cclxuXHRcdFx0aWYgKCFpc01vdmVhYmxlKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBuZXh0RWxlbWVudCA9IChjdXJyZW50RWxlbWVudCA9PT0gYWN0aXZlRWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpID9cclxuXHRcdFx0XHRjdXJyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcgOlxyXG5cdFx0XHRcdGN1cnJlbnRFbGVtZW50O1xyXG5cclxuXHRcdFx0dG9kb0xpc3QuaW5zZXJ0QmVmb3JlKGFjdGl2ZUVsZW1lbnQsIG5leHRFbGVtZW50KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0XHJcbi8qIHRoZW1lIGNoYW5naW5nICovXHJcblx0XHJcblx0dGhlbWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRpZiAobWFpbldyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGFyay10aGVtZVwiKSkge1xyXG5cdFx0XHRtYWluV3JhcC5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrLXRoZW1lJyk7XHJcblx0XHRcdG1haW5XcmFwLmNsYXNzTGlzdC5hZGQoJ2xpZ2h0LXRoZW1lJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtYWluV3JhcC5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodC10aGVtZScpO1xyXG5cdFx0XHRtYWluV3JhcC5jbGFzc0xpc3QuYWRkKCdkYXJrLXRoZW1lJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0XHJcbn0pOyJdLCJmaWxlIjoibWFpbi5qcyJ9
