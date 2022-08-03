type QualityResolutionTypes = 144 | 240 | 360 | 480 | 576 | 720 | 1080 | 1440 | 2160 | 4320;
export type QualityNameTypes = `${QualityResolutionTypes}p${any}`;
export type QualityTypes = 'auto' | QualityNameTypes;

export type QualityMapTypes = {
	[quality: QualityNameTypes]: {
		name: QualityNameTypes;
		label: string;
		height: number;
		uri: string;
	};
};

export type SubtitleTypes = {
	title: string;
	language: string;
	type: 'text/vtt';
	uri: string;
};

export type ChapterTypes = {
	time: number;
	title: string;
};

export type ManifestQualityMapTypes = {
	label: string;
	name: QualityNameTypes;
	height: number;
}[];

export type ManifestTypes = {
	id: string;
	workspaceId: string;
	projectId: string;
	folderId: string;
	title: string;
	posterUrl: string;
	chapters: ChapterTypes[];
	subtitles: SubtitleTypes[];
	hlsLink: string;
	dashLink: string;
	qualityMap: QualityMapTypes;
};

export type ManifestEventLoadTypes = {
	title: string;
	chapters: ChapterTypes[];
	subtitles: {
		title: string;
		language: string;
	}[];
	quality: {label: string; name: QualityNameTypes}[];
};

export type ManifestEventsTypes = {
	onManifestLoadStart?: () => void;
	onManifestLoad?: (manifest: ManifestEventLoadTypes) => void;
	onManifestError?: (error: unknown) => void;
};
