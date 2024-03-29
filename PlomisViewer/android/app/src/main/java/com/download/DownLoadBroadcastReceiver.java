package com.download;


import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.widget.Toast;
import java.io.File;
import android.os.Build;
import android.support.v4.content.FileProvider;
//import androidx.core.content.FileProvider;
import com.plomisviewer.BuildConfig;



public class DownLoadBroadcastReceiver extends BroadcastReceiver {

    public void installApp( Context context ) {

        File file = new File( context.getExternalFilesDir( Environment.DIRECTORY_DOWNLOADS ), DownloadApk.description );

        if ( file.exists()) {

            Intent intent = new Intent( Intent.ACTION_VIEW );

            // 由于没有在Activity环境下启动Activity,设置下面的标签
            intent.setFlags( Intent.FLAG_ACTIVITY_NEW_TASK );

            if ( Build.VERSION.SDK_INT >= 24 ) { // 判读版本是否在7.0以上

                // 参数1 上下文, 参数2 Provider主机地址 和配置文件中保持一致, 参数3  共享的文件
                Uri apkUri = FileProvider.getUriForFile( context, BuildConfig.APPLICATION_ID + "" + ".fileprovider", file );
                // 添加这一句表示对目标应用临时授权该Uri所代表的文件
                intent.addFlags( Intent.FLAG_GRANT_READ_URI_PERMISSION );
                intent.setDataAndType( apkUri, "application/vnd.android.package-archive" );

            } else {
                intent.setDataAndType( Uri.fromFile( file ), "application/vnd.android.package-archive" );
            }
            context.startActivity( intent );
        } else {
            Toast.makeText( context, "安装包下载失败", Toast.LENGTH_SHORT ).show();
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {

        long myDwonloadID = intent.getLongExtra( DownloadManager.EXTRA_DOWNLOAD_ID, -1 );
        SharedPreferences sPreferences = context.getSharedPreferences("ggfw_download", 0 );
        long refernece = sPreferences.getLong("ggfw_download_apk", 0 );

        if ( refernece == myDwonloadID ) {
            DownloadManager dManager = ( DownloadManager ) context.getSystemService( Context.DOWNLOAD_SERVICE );
            DownloadManager.Query querybyId = new DownloadManager.Query();

            querybyId.setFilterById( myDwonloadID );
            Cursor myDownload = dManager.query( querybyId );
            String dolownname = null;

            if ( myDownload.moveToFirst()) {
                int status = myDownload.getInt( myDownload.getColumnIndex( DownloadManager.COLUMN_STATUS ));

                if ( status == DownloadManager.STATUS_SUCCESSFUL ) {
                    installApp( context );
                } else {
                    Toast.makeText( context, "下载失败", Toast.LENGTH_LONG ).show();
                    dManager.remove( myDwonloadID );
                    myDownload.close();
                    return;
                }
                myDownload.close();
            }

            if ( dolownname == null ) {
                return;
            }
        }
    }
}
