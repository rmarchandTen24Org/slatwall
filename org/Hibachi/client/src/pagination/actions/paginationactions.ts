//constants
export const GET_SELECTED_PAGE_SHOW_OPTIONS='GET_SELECTED_PAGE_SHOW_OPTIONS';
export const PAGE_SHOW_OPTION_CHANGED="PAGE_SHOW_OPTION_CHANGED";
export const GET_TOTAL_PAGES='GET_TOTAL_PAGES';
export const SET_TOTAL_PAGES='SET_TOTAL_PAGES';
export const GET_PAGE_START='GET_PAGE_START';
export const SET_PAGE_START='SET_PAGE_START';
export const GET_PAGE_END='GET_PAGE_END';
export const SET_PAGE_END='SET_PAGE_END';
export const GET_RECORDS_COUNT='GET_RECORDS_COUNT';
export const SET_RECORDS_COUNT='SET_RECORDS_COUNT';
export const GET_PAGE_SHOW_OPTIONS='GET_PAGE_SHOW_OPTIONS';
export const SET_PAGE_SHOW_OPTIONS='SET_PAGE_SHOW_OPTIONS';
export const GET_PAGE_SHOW='GET_PAGE_SHOW';
export const SET_PAGE_SHOW='SET_PAGE_SHOW';
export const GET_CURRENT_PAGE='GET_CURRENT_PAGE';
export const SET_CURRENT_PAGE='SET_CURRENT_PAGE';
export const PREVIOUS_PAGE='PREVIOUS_PAGE';
export const NEXT_PAGE='NEXT_PAGE';
export const HAS_PREVIOUS='HAS_PREVIOUS';
export const HAS_NEXT='HAS_NEXT';
export const SHOW_PREVIOUS_JUMP='SHOW_PREVIOUS_JUMP';
export const SHOW_NEXT_JUMP='SHOW_NEXT_JUMP';
export const PREVIOUS_JUMP='PREVIOUS_JUMP';
export const NEXT_JUMP='NEXT_JUMP';
export const SHOW_PAGE_NUMBER='SHOW_PAGE_NUMBER';
export const SET_PAGE_RECORDS_INFO='SET_PAGE_RECORDS_INFO';

//action creators
export function previousPage(pagination){
	return {
		type:PREVIOUS_PAGE,
		pagination
	};

}

export function nextPage(pagination){
	return {
		type:NEXT_PAGE,
		pagination
	};

}

export function getSelectedPageShowOptions(pagination){
	return {
		type:GET_SELECTED_PAGE_SHOW_OPTIONS,
		pagination
	};

}

export function pageShowOptionChanged(pagination){
	return {
		type:PAGE_SHOW_OPTION_CHANGED,
		pagination
	};

	// this.setPageShow(pageShowOption.value);
	// this.setCurrentPage(1);
};

export function getTotalPages(pagination){
	return {
		type:GET_TOTAL_PAGES,
		pagination
	};

};
export function setTotalPages(pagination){
	return {
		type:SET_TOTAL_PAGES,
		pagination
	};

};
export function getPageStart(pagination){
	return {
		type:GET_PAGE_START,
		pagination
	};

};
export function setPageStart(pagination){
	return {
		type:SET_PAGE_START,
		pagination
	};

};
export function getPageEnd(pagination){
	return {
		type:GET_PAGE_END,
		pagination
	};

};
export function setPageEnd(pagination){
	return {
		type:SET_PAGE_END,
		pagination
	};

};
export function getRecordsCount(pagination){
	return {
		type:GET_RECORDS_COUNT,
		pagination
	};

};
export function setRecordsCount(pagination){
	return {
		type:SET_RECORDS_COUNT,
		pagination
	};

};
export function getPageShowOptions(pagination){
	return {
		type:GET_PAGE_SHOW_OPTIONS,
		pagination
	};

};
export function setPageShowOptions(pagination){
	return {
		type:SET_PAGE_SHOW_OPTIONS,
		pagination
	};

};
export function getPageShow(pagination){
	return {
		type:GET_PAGE_SHOW,
		pagination
	};

};
export function setPageShow(pagination){
	return {
		type:SET_PAGE_SHOW,
		pagination
	};

};
export function getCurrentPage(pagination){
	return {
		type:GET_CURRENT_PAGE,
		pagination
	};

};
export function setCurrentPage(pagination){
	return {
		type:SET_CURRENT_PAGE,
		pagination
	};

};

export function hasPrevious(pagination){
	return {
		type:HAS_PREVIOUS,
		pagination
	};

};
export function hasNext(pagination){
	return {
		type:HAS_NEXT,
		pagination
	};

};
export function showPreviousJump(pagination){
	return {
		type:SHOW_PREVIOUS_JUMP,
		pagination
	};

};
export function showNextJump(pagination){
	return {
		type:SHOW_NEXT_JUMP,
		pagination
	};

};
export function previousJump(pagination){
	return {
		type:PREVIOUS_JUMP,
		pagination
	};

};
export function nextJump(pagination){
	return {
		type:NEXT_JUMP,
		pagination
	};

};
export function showPageNumber(pagination){
	return {
		type:SHOW_PAGE_NUMBER,
		pagination
	};
};
export function setPageRecordsInfo(pagination){
	return {
		type:SET_PAGE_RECORDS_INFO,
		pagination
	};
};