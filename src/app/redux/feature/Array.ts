import { createSlice } from "@reduxjs/toolkit";


type ArrayType = {
    onSearch: boolean,
    initialDatas: any | null,
    datas: any | null,
    nbShow: number,
    currentPage: number,
    sortBy: string[],
    displayModal: boolean,
    userData: any
}

type Data = {
    data: any
}

const initialState: ArrayType = {
    onSearch: false,
    initialDatas: null,
    datas: null,
    nbShow: 10,
    currentPage: 1,
    sortBy: ["", ""],
    displayModal: false,
    userData: null
}

export const Array = createSlice({
    name: 'Array',
    initialState,
    reducers: {
        true: (state) => {
            state.onSearch = true
        },
        false: (state) => {
            state.onSearch = false
        },
        storeData: (state, action) => {
            state.datas = action.payload.datas
            state.initialDatas = action.payload.datas
        },
        storeDataSearch: (state, action) => {
            state.datas = action.payload.datas
            state.onSearch = true
        },
        storeDataSearchInv: (state, action) => {
            state.datas = action.payload.datas
            state.onSearch = false
        },
        changeNbShow: (state, action) => {
            state.nbShow = action.payload.nbShow
        },
        nextPage: (state) => {
            state.currentPage = state.currentPage + 1
        },
        previousPage: (state) => {
            state.currentPage = state.currentPage - 1
        },
        selectPage: (state, action) => {
            state.currentPage = action.payload.page
        },
        changeSortBy: (state, action) => {
            state.sortBy = action.payload.sortBy
        },
        changeDisplayModal: (state, action) => {
            state.displayModal = action.payload.display
            state.userData = action.payload.userData
        },
        resetData: (state) => {
            state.sortBy = ["", ""]
            state.currentPage = 1
            state.nbShow = 10
            state.onSearch = false
            state.datas = state.initialDatas
        }
    }
})