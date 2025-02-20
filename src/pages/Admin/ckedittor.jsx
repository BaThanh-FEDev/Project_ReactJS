import React from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

const CKEditorDemo = () => {
    const cloud = useCKEditorCloud( {
        version: '44.1.0',
        premium: true
    } );

    if ( cloud.status === 'error' ) {
        return <div>Error!</div>;
    }

    if ( cloud.status === 'loading' ) {
        return <div>Loading...</div>;
    }

    const {
        ClassicEditor,
        Essentials,
        Paragraph,
        Bold,
        Italic
    } = cloud.CKEditor;

    const { FormatPainter } = cloud.CKEditorPremiumFeatures;

    return (
        <CKEditor
            editor={ ClassicEditor }
            data={ '<p>Hello world!</p>' }
            config={ {
                licenseKey: '<YOUR_LICENSE_KEY>',
                plugins: [ Essentials, Paragraph, Bold, Italic, FormatPainter ],
                toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|', 'formatPainter' ]
            } }
        />
    );
};

export default CKEditorDemo