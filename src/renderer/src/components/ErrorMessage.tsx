import React from 'react';
import { errorData } from '../../../shared/constants';
import ErrorItem from './ErrorItem';

type Props = {
  diffPixelList: (string | number)[];
  diffImageList: string[];
};

const ErrorMessage: React.FC<Props> = ({ diffPixelList, diffImageList }) => {
  const hasDiffImageError = diffImageList.some((item) => item === errorData.diffImage);
  const hasDiffPixelError = diffPixelList.some(
    (item) =>
      item === errorData.imageSize ||
      item === errorData.basicAuthentication ||
      item === errorData.pageAccess
  );

  if (!hasDiffImageError && !hasDiffPixelError) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      {diffImageList.map((item, index) => {
        if (item === errorData.diffImage) {
          return (
            <ErrorItem
              key={crypto.randomUUID()}
              index={index}
              message="差分画像を作成することができませんでした。もう一度実行してください。"
            />
          );
        }
        return null;
      })}

      {diffPixelList.map((item, index) => {
        if (item === errorData.imageSize) {
          return (
            <ErrorItem
              key={crypto.randomUUID()}
              index={index}
              message="差分の確認を行うことができませんでした。大量の差分が発生している可能性があるためページをご確認ください。"
            />
          );
        }

        if (item === errorData.basicAuthentication) {
          return (
            <ErrorItem
              key={crypto.randomUUID()}
              index={index}
              message="Basic認証に失敗しました。正しいユーザー名とパスワードを入力してください。"
            />
          );
        }

        if (item === errorData.pageAccess) {
          return (
            <ErrorItem
              key={crypto.randomUUID()}
              index={index}
              message="ページにアクセスできませんでした。URLに誤りがないかご確認ください。"
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default ErrorMessage;
