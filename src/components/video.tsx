import {ResizeMode, Video} from 'expo-av';
import React, {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {ImageProps, ImageResizeMode, Platform, StyleSheet, View} from 'react-native';
import {ReactVideoProps, VideoRef} from 'react-native-video';
import {METRIC_HOST} from '../hooks/metric/contants';
import useManifest, {ManifestEventsTypes} from '../hooks/use-manifest';
import {QualityTypes} from '../types';

type ReactVideoPropsOmit = Omit<
	ReactVideoProps,
	'source' | 'poster' | 'posterResizeMode' | 'selectedVideoTrack'
>;

export type ReactNativeKinescopeVideoProps = ReactVideoPropsOmit &
	ManifestEventsTypes & {
		preload?: boolean;
		videoId: string;
		posterResizeMode?: ImageResizeMode;
		externalId?: string;
		quality?: QualityTypes;
		autoSeekChangeQuality?: boolean; // ios only
		referer?: string;
		drmAuthToken?: string;
		poster: ImageProps['source'];
		PosterComponent?: ReactNode;
	};

function ReactNativeKinescopeVideo(props: ReactNativeKinescopeVideoProps) {
	const {
		videoId,
		quality = 'auto',
		referer = `https://${METRIC_HOST}`,
		drmAuthToken = '',
		style,
		onManifestLoadStart,
		onManifestLoad,
		onManifestError,
		poster,
		PosterComponent,
	} = props;

	const videoRef = useRef<VideoRef>();
	const seekQuality = useRef<number>(0);

	const [loadingVideo, setLoadingVideo] = useState<boolean>(false);
	const [videoStartLoad, setVideoStartLoad] = useState(false);

	const {loading, manifest} = useManifest({
		videoId,
		referer,
		drmAuthToken,
		onManifestLoadStart,
		onManifestLoad,
		onManifestError,
	});

	useEffect(() => {
		seekQuality.current = 0;
		setLoadingVideo(false);
		setVideoStartLoad(false);
	}, [videoId]);

	const handleRef = useCallback(
		current => {
			videoRef.current = current;
			if (ref) {
				if (typeof ref === 'function') {
					ref && ref(current);
				} else {
					ref.current = current;
				}
			}
		},
		[ref],
	);

	if (loading || !manifest) {
		return <View style={style} />;
	}

	const getHlsLink = () => {
		return manifest.qualityMap[quality]?.uri || manifest.hlsLink;
	};

	const getSource = () => {
		if (Platform.OS === 'android' && manifest.dashLink) {
			return {
				uri: manifest.dashLink,
			};
		}
		return {
			uri: getHlsLink(),
		};
	};
	return (
		<Video
			ref={handleRef}
			style={[StyleSheet.absoluteFill, {height: 400}]}
			source={getSource()}
			useNativeControls
			posterSource={poster}
			usePoster={true}
			PosterComponent={() => {
				if (PosterComponent) return <PosterComponent />;
				return null;
			}}
			resizeMode={ResizeMode.CONTAIN}
			isLooping
		/>
	);
}

export default ReactNativeKinescopeVideo;
