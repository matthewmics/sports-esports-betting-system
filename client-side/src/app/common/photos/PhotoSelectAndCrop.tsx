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

    useEffect(() => {
        return (() => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        });
    }, [files]);


    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map((file: object) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const cropper = useRef<Cropper>(null);
    const cropImage = () => {
        if (cropper.current && typeof cropper.current.getCroppedCanvas() === 'undefined') {
            return;
        }

        cropper && cropper.current && cropper.current.getCroppedCanvas().toBlob((blob: any) => {
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
                        ref={cropper}
                        src={files[0].preview}
                        style={{ height: 200, width: '100%' }}
                        // Cropper.js options
                        aspectRatio={4/3}
                        guides={false}
                        viewMode={1}
                        preview='.img-preview'
                        dragMode='move'
                        scalable={true}
                        cropBoxMovable={true}
                        cropBoxResizable={true}
                        crop={cropImage}
                    />
                </Segment>
                <Button primary content='PROCEED' onClick={() => { onImageSet(resultFile); closeModal(); }} />
                <Button content='CANCEL' onClick={() => { closeModal(); }} />
            </Fragment>
    )
}

export default observer(PhotoSelectAndCrop);