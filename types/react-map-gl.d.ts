declare module 'react-map-gl/mapbox' {
    import * as React from 'react';
    import * as MapboxGL from 'mapbox-gl';

    export interface ViewState {
        latitude: number;
        longitude: number;
        zoom: number;
        pitch: number;
        bearing: number;
        padding?: any;
    }

    export interface ViewStateChangeEvent {
        viewState: ViewState;
    }

    export interface MapProps extends React.ComponentProps<any> {
        mapboxAccessToken?: string;
        mapStyle?: string | any;
        initialViewState?: Partial<ViewState>;
        viewState?: ViewState;
        onMove?: (evt: ViewStateChangeEvent) => void;
        onMoveEnd?: (evt: ViewStateChangeEvent) => void;
        style?: React.CSSProperties;
        children?: React.ReactNode;
        maxPitch?: number;
    }

    const Map: React.FC<MapProps>;

    export const Marker: React.FC<any>;
    export const NavigationControl: React.FC<any>;
    export const GeolocateControl: React.FC<any>;

    export default Map;
}
