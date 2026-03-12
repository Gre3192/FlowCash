const DATA1 = {

    year: 2026,
    prevEndWallet: 123,
    currentSurplusMoneyAdded: [342,234,678,675,456,848,397,585,68,54,987,69],
    currentSavedMoney: [342,4234,25,325,532,654,234,76,987,456,34,346],
    savedMoney: 4564,
    categories: [
        {
            id: 'cat_1',
            title: 'Abbonamenti',
            type: 'expense',
            elements: [
                { id: 'row_1_1', name: 'ChatGPT', limits: [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1], spent: [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
                { id: 'row_1_2', name: 'Amazon Prime', limits: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22], spent: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] },
            ],
        },
        {
            id: 'cat_2',
            title: 'Sanità',
            type: 'expense',
            rows: [
                { id: 'row_2_1', name: 'Nutrizionista', limits: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22], spent: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
                { id: 'row_2_2', name: 'Dottore', limits: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22], spent: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 45] },
            ],
        },
        {
            id: 'cat_3',
            title: 'Stipendio',
            type: 'income',
            rows: [
                { id: 'row_3_1', name: 'Nutrizionista', limits: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22], spent: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
                { id: 'row_3_2', name: 'Dottore', limits: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22], spent: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] },
            ],
        },
        {
            id: 'cat_4',
            title: 'Lezioni private',
            type: 'income',
            rows: [
                { id: 'row_4_1', name: 'Nutrizionista', limits: [0, 3, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22], spent: [0, 3, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
                { id: 'row_4_2', name: 'Dottore', limits: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22], spent: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] },
            ],
        },
    ]
}

export default DATA1;
