
import * as actions from '../actions/paginationactions';

const initialState = {
	pageShow:10,
    currentPage:1,
    pageStart:0,
    pageEnd:0,
    recordsCount:0,
    totalPages:0
}

export default function pagination(state = initialState, action) {
  	switch (action.type) {
		case action.PREVIOUS_PAGE:
	 		return Object.assign({}, state, {
				 currentPage:state.currentPage-1
			});

		case action.NEXT_PAGE:
	 		return Object.assign({}, state, {
				 currentPage:state.currentPage+1
			});
		// case action.GET_SELECTED_PAGE_SHOW_OPTIONS:
		//   return Object.assign({}, state, { isFetching: true });;
		// case action.PAGE_SHOW_OPTION_CHANGED:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.GET_TOTAL_PAGES:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SET_TOTAL_PAGES:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.GET_PAGE_START:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SET_PAGE_START:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.GET_PAGE_END:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SET_PAGE_END:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.GET_RECORDS_COUNT:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SET_RECORDS_COUNT:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.GET_PAGE_SHOW_OPTIONS:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SET_PAGE_SHOW_OPTIONS:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.GET_PAGE_SHOW:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SET_PAGE_SHOW:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.GET_CURRENT_PAGE:
		// 	return Object.assign({}, state, { isFetching: true });;


		// case action.SET_CURRENT_PAGE:
		// 	return Object.assign({}, state, { currentPage: state.currentPage });;
		// case action.PREVIOUS_PAGE:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.NEXT_PAGE:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.HAS_PREVIOUS:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.HAS_NEXT:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SHOW_PREVIOUS_JUMP:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SHOW_NEXT_JUMP:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.PREVIOUS_JUMP:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.NEXT_JUMP:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SHOW_PAGE_NUMBER:
		// 	return Object.assign({}, state, { isFetching: true });;
		// case action.SET_PAGE_RECORDS_INFO:
		// 	return Object.assign({}, state, { isFetching: true });;
		default:
			return state;
	}
}