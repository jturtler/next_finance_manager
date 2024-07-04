export default function Modal( { isVisible, onClose, children }: { isVisible: boolean, onClose: () => void, children: React.ReactNode } ) {

	if ( !isVisible ) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-25 backgrop-blur-sm flex justify-center items-center">
			{ children }
		</div>
	);
};