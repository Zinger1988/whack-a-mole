

class Field{

    static cells;
    static difficulityMode;
    static counter;
    static userScore = 0;
    static pcScore = 0;

    static DIFFICULITY_MAP = {
        easy: 1500,
        medium: 1000,
        hard: 500
    }

    static setDiffuculity(mode){
        Field.difficulityMode = Field.DIFFICULITY_MAP[mode]
    }

    static createCells(cellsQuantity){
        Field.cells = new Array(cellsQuantity ** 2)
        for(let i = 0; i < Field.cells.length; i++){
            Field.cells[i] = new Cell(i);
        }
    }

    static stopCounter(){
        clearTimeout(Field.counter);
    }

    static renderCells(size){
        const subArray = [];
        const root = document.getElementById('root');
        const fragment = document.createDocumentFragment();

        const table = document.createElement('table');
        table.classList.add('table');

        for(let i = 0; i < Field.cells.length/ size; i++){
            subArray[i] = Field.cells.slice(i * size, (i * size) + size);
        }

        subArray.forEach(item => {
            const tableRow = document.createElement('tr');
            tableRow.classList.add('table-row');

            item.forEach(cell => tableRow.append(cell.element));

            table.append(tableRow);
        })

        fragment.append(table);

        root.append(fragment);
    }

    static startCounter(){

        if(Field.userScore > (Field.cells.length / 2) || Field.pcScore > (Field.cells.length / 2)){
            console.log('game over')
            Field.stopCounter();
            return
        }

        console.log('user score: ' + Field.userScore, ', pc score: ' + Field.pcScore);

        const cells = Field.cells.filter( item => item.getStatus() == 'free');
        const index = Math.floor(Math.random() * cells.length);

        cells[index].selectEl();

        Field.counter = setTimeout(function () {
            cells[index].pcSelect();
            if(Field.counter) {
                clearTimeout(Field.counter);
                Field.startCounter()
            }
        }, Field.difficulityMode)
    }

    constructor(size, mode) {
        Field.size = size;
        Field.setDiffuculity(mode);
        Field.createCells(size);
        Field.renderCells(size);
        Field.startCounter();
    }
}

class Cell {
    static STATUSES = {
        pcScored: 'pc',
        userScored: 'user',
        free: 'free',
        active: 'active'
    }

    #status = Cell.STATUSES.free;

    constructor() {
        this.#status = Cell.STATUSES.free;

        this.element = document.createElement('td');
        this.element.classList.add('table-cell');
        this.element.addEventListener('click', () => this.setUserStatus())
    }

    setUserStatus(){
        if(this.#status === Cell.STATUSES.active){
            this.#status = Cell.STATUSES.userScored;
            this.element.classList.remove('highlighted');
            this.element.classList.add('userScored');
            Field.userScore++
        }
    }

    getStatus(){
        return this.#status
    }

    selectEl(){
        this.#status = Cell.STATUSES.active;
        this.element.classList.add('highlighted')
    }

    unSelectEl(){
        this.element.classList.remove('highlighted')
    }

    pcSelect(){
        if(this.#status !== Cell.STATUSES.userScored){
            this.element.classList.remove('highlighted');
            this.element.classList.add('pcSelect')
            Field.pcScore++
        }
    }
}

class Message {

}