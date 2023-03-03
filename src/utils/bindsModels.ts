export type BindData = {
	id: number;
	author?: string;
	text?: string;
};

export type NewBindData = {
	author: string;
	text: string;
};

export type BindSuggestionData = BindData & { proposedBy: string };
export type NewBindSuggestionData = NewBindData & { proposedBy: string };
