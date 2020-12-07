import { observer } from 'mobx-react-lite';
import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

interface IProps {
    onImageSet: (file: Blob | null) => void;
}

const dropzoneStyles = {
    border: 'dashed 3px',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: '200px'
}
const dropzoneActive = {
    borderColor: 'green'
}

const PhotoSelectAndCrop: React.FC<IProps> = ({ onImageSet }) => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;

    let resultFile: Blob | null = null;
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return (() => {
            files.forEach((file: any) => {URL.revokeObjectURL(file.preview)});
        });
    }, [files]);


    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map((file: object) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const cropperRef = useRef<HTMLImageElement>(null);
    const cropImage = () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;

        cropper && cropper.getCroppedCanvas().toBlob((blob: any) => {
            resultFile = blob;
        }, 'image');
    };


    return (
        !(files.length > 0) ?
            <Fragment>
                <Segment basic>
                    <div {...getRootProps()} style={isDragActive ? { ...dropzoneStyles, ...dropzoneActive } : dropzoneStyles}>
                        <input {...getInputProps()} />
                        <Icon name='upload' size='huge' />
                        <Header content='Drop image here' />
                    </div>
                </Segment>
                <Button content='CANCEL' onClick={closeModal} icon='cancel' />
            </Fragment>
            :
            <Fragment>
                <Segment basic>
                    <Cropper
                        ref={cropperRef}
                        src={files[0].preview}
                        style={{ height: 200, width: '100%' }}
                        // Cropper.js options
                        aspectRatio={4 / 3}
                        guides={false}
                        viewMode={1}
                        dragMode='move'
                        scalable={true}
                        cropBoxMovable={true}
                        cropBoxResizable={true}
                        crop={cropImage}
                    />
                </Segment>
                <Button loading={loading} primary content='PROCEED' onClick={() => {
                    setLoading(true); setTimeout(() => {
                        onImageSet(resultFile); closeModal();
                    }, 500)
                }} />
                <Button disabled={loading} content='CANCEL' onClick={() => { closeModal(); }} />
            </Fragment>
    )
}

export default observer(PhotoSelectAndCrop);