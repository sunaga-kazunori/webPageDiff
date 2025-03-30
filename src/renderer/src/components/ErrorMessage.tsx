import React from 'react';
import { errorData } from '../../../shared/constants';
import ErrorItem from './ErrorItem';

type Props = {
  diffPixelList: (string | number)[];
  diffImageList: string[];
};

const errorMessages = {
  diffImage: '差分画像を作成することができませんでした。もう一度実行してください。',
  imageSize:
    '差分の確認を行うことができませんでした。大量の差分が発生している可能性があるためページをご確認ください。',
  basicAuthentication: 'Basic認証に失敗しました。正しいユーザー名とパスワードを入力してください。',
  pageAccess: 'ページにアクセスできませんでした。URLに誤りがないかご確認ください。'
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
            <ErrorItem key={crypto.randomUUID()} index={index} message={errorMessages.diffImage} />
          );
        }
        return null;
      })}

      {diffPixelList.map((item, index) => {
        if (item === errorData.imageSize) {
          return (
            <ErrorItem key={crypto.randomUUID()} index={index} message={errorMessages.imageSize} />
          );
        }

        if (item === errorData.basicAuthentication) {
          return (
            <ErrorItem
              key={crypto.randomUUID()}
              index={index}
              message={errorMessages.basicAuthentication}
            />
          );
        }

        if (item === errorData.pageAccess) {
          return (
            <ErrorItem key={crypto.randomUUID()} index={index} message={errorMessages.pageAccess} />
          );
        }

        return null;
      })}
    </div>
  );
};

export default ErrorMessage;
